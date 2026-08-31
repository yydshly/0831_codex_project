import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import axe from 'axe-core'
import { chromium } from 'playwright-core'

const baseUrl = process.env.EARLY_TOOLS_LAB_URL ?? 'http://127.0.0.1:5173/'
const chromePath =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const evidenceDir = resolve(import.meta.dirname, '../../../research/early-tools/assets')

await mkdir(evidenceDir, { recursive: true })

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
})

const results = []

function expect(condition, message) {
  if (!condition) throw new Error(message)
}

async function auditView({ name, viewport, theme, screenshot, sourceScreenshot, interactive = false }) {
  const context = await browser.newContext({
    viewport,
    colorScheme: theme,
    reducedMotion: 'no-preference',
  })

  await context.addInitScript((preferredTheme) => {
    localStorage.setItem('early-tools-lab-theme', preferredTheme)
  }, theme)

  const page = await context.newPage()
  const consoleErrors = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => consoleErrors.push(error.message))

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__EARLY_TOOLS_LAB_READY__ === true)

  expect(await page.locator('h1').isVisible(), `${name}: h1 不可见`)
  expect((await page.locator('[data-library-id]').count()) === 7, `${name}: 能力库数量不是 7`)
  expect((await page.locator('[data-role-id]').count()) === 4, `${name}: 角色数量不是 4`)
  expect((await page.locator('.stat-strip article').count()) === 4, `${name}: 核心指标数量不是 4`)
  expect((await page.locator('.source-card').count()) === 5, `${name}: 数据来源数量不是 5`)
  expect((await page.locator('.source-chain li').count()) === 5, `${name}: 信息处理链数量不是 5`)
  expect((await page.locator('.provenance-callout li').count()) === 3, `${name}: 来源复用原则数量不是 3`)
  expect(
    await page.evaluate(
      () =>
        Boolean(
          document.querySelector('#sources').compareDocumentPosition(document.querySelector('#meaning')) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        ),
    ),
    `${name}: 数据来源没有位于角色意义之前`,
  )

  const layout = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    theme: document.documentElement.dataset.theme,
    externalResources: performance
      .getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((url) => new URL(url, location.href).origin !== location.origin),
  }))

  expect(layout.scrollWidth <= layout.clientWidth + 1, `${name}: 页面出现根级横向溢出`)
  expect(layout.theme === theme, `${name}: 主题初始化失败`)
  expect(layout.externalResources.length === 0, `${name}: 存在外部运行时资源`)

  if (sourceScreenshot) {
    if (viewport.width >= 760) {
      await page.locator('.source-board').scrollIntoViewIfNeeded()
      await page.evaluate(() => scrollBy(0, -100))
      await page.locator('.source-board').screenshot({ path: resolve(evidenceDir, sourceScreenshot) })
      if (name === 'desktop-light') {
        await page.locator('.provenance-callout').scrollIntoViewIfNeeded()
        await page.evaluate(() => scrollBy(0, -100))
        await page
          .locator('.provenance-callout')
          .screenshot({ path: resolve(evidenceDir, 'web-demo-source-principles.png') })
      }
    } else {
      await page.locator('#sources-title').scrollIntoViewIfNeeded()
      await page.screenshot({ path: resolve(evidenceDir, sourceScreenshot), fullPage: false })
    }
  }

  if (interactive) {
    await page.locator('[data-role-id="builder"]').click()
    expect(
      (await page.locator('[data-role-id="builder"]').getAttribute('aria-selected')) === 'true',
      `${name}: 角色切换状态错误`,
    )
    expect(
      (await page.locator('#role-panel').innerText()).includes('冷启动分发节点'),
      `${name}: 角色解释未更新`,
    )
    await page
      .locator('.role-workspace')
      .screenshot({ path: resolve(evidenceDir, 'web-demo-role-builder.png') })

    await page.locator('[data-library-id="experiments"]').click()
    expect(
      (await page.locator('#library-panel').innerText()).includes('验证实验'),
      `${name}: 能力库解释未更新`,
    )
    await page
      .locator('.library-workspace')
      .screenshot({ path: resolve(evidenceDir, 'web-demo-library-experiments.png') })

    await page.locator('[data-role-id="research"]').focus()
    await page.keyboard.press('ArrowRight')
    expect(
      (await page.evaluate(() => document.activeElement?.dataset.roleId)) === 'builder',
      `${name}: 方向键没有移动角色焦点`,
    )

    const firstRoadmapItem = page.locator('.roadmap-list details').first()
    await firstRoadmapItem.locator('summary').click()
    expect(!(await firstRoadmapItem.evaluate((item) => item.open)), `${name}: 路线图无法收起`)
    await firstRoadmapItem.locator('summary').click()
    expect(await firstRoadmapItem.evaluate((item) => item.open), `${name}: 路线图无法展开`)

    await page.locator('.theme-toggle').click()
    expect(
      (await page.locator('html').getAttribute('data-theme')) === 'dark',
      `${name}: 主题按钮没有切换到 dark`,
    )
    expect(
      (await page.locator('.theme-toggle').getAttribute('aria-pressed')) === 'true',
      `${name}: 主题按钮 aria-pressed 未同步`,
    )
    await page.locator('.theme-toggle').click()
  }

  await page.addScriptTag({ content: axe.source })
  const axeResults = await page.evaluate(async () => {
    const result = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    })
    return {
      violations: result.violations.map((item) => ({
        id: item.id,
        impact: item.impact,
        nodes: item.nodes.length,
        targets: item.id === 'color-contrast' ? [] : item.nodes.map((node) => node.target),
      })),
      incomplete: result.incomplete.map((item) => ({
        id: item.id,
        nodes: item.nodes.length,
        targets: item.id === 'color-contrast' ? [] : item.nodes.map((node) => node.target),
      })),
    }
  })

  expect(axeResults.violations.length === 0, `${name}: Axe 检出 ${JSON.stringify(axeResults.violations)}`)
  expect(consoleErrors.length === 0, `${name}: 浏览器控制台错误 ${JSON.stringify(consoleErrors)}`)

  await page.evaluate(() => scrollTo(0, 0))
  await page.waitForTimeout(120)
  await page.screenshot({ path: resolve(evidenceDir, screenshot), fullPage: false })
  results.push({ name, viewport, theme, layout, axe: axeResults, consoleErrors })
  await context.close()
}

try {
  await auditView({
    name: 'desktop-light',
    viewport: { width: 1440, height: 1000 },
    theme: 'light',
    screenshot: 'web-demo-1440-light.png',
    sourceScreenshot: 'web-demo-sources-1440-light.png',
    interactive: true,
  })
  await auditView({
    name: 'desktop-dark',
    viewport: { width: 1440, height: 1000 },
    theme: 'dark',
    screenshot: 'web-demo-1440-dark.png',
    sourceScreenshot: 'web-demo-sources-1440-dark.png',
  })
  await auditView({
    name: 'tablet-light',
    viewport: { width: 768, height: 900 },
    theme: 'light',
    screenshot: 'web-demo-768-light.png',
  })
  await auditView({
    name: 'mobile-light',
    viewport: { width: 390, height: 844 },
    theme: 'light',
    screenshot: 'web-demo-390-light.png',
    sourceScreenshot: 'web-demo-sources-390-light.png',
  })

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  })
  const page = await context.newPage()
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  const reducedMotion = await page.evaluate(() => ({
    query: matchMedia('(prefers-reduced-motion: reduce)').matches,
    transitionDuration: getComputedStyle(document.querySelector('.theme-toggle')).transitionDuration,
  }))
  expect(reducedMotion.query, 'reduced motion 媒体查询未生效')
  expect(reducedMotion.transitionDuration === '1e-05s', 'reduced motion 未把过渡降至近零')
  results.push({ name: 'reduced-motion', reducedMotion })
  await context.close()

  const noScriptContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: false,
  })
  const noScriptPage = await noScriptContext.newPage()
  await noScriptPage.goto(baseUrl, { waitUntil: 'networkidle' })
  const noScriptState = await noScriptPage.evaluate(() => ({
    visible: getComputedStyle(document.querySelector('.noscript-shell')).display !== 'none',
    text: document.querySelector('.noscript-shell').innerText,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  expect(noScriptState.visible, 'noscript 摘要不可见')
  expect(noScriptState.text.includes('信息来源'), 'noscript 摘要缺少信息来源')
  expect(noScriptState.scrollWidth <= noScriptState.clientWidth + 1, 'noscript 手机视口出现横向溢出')
  await noScriptPage.screenshot({
    path: resolve(evidenceDir, 'web-demo-390-noscript.png'),
    fullPage: false,
  })
  results.push({ name: 'noscript-mobile', noScriptState })
  await noScriptContext.close()

  process.stdout.write(`${JSON.stringify({ ok: true, baseUrl, results }, null, 2)}\n`)
} finally {
  await browser.close()
}
