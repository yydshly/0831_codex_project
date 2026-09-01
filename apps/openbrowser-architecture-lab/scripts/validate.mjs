import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import axe from 'axe-core'
import { chromium } from 'playwright-core'

const baseUrl = process.env.OPENBROWSER_LAB_URL ?? 'http://127.0.0.1:5187/'
const browserCandidates = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean)
const chromePath = browserCandidates.find((candidate) => existsSync(candidate))
const evidenceDir = resolve(import.meta.dirname, '../../../research/lyu0805-openbrowser/evidence')

if (!chromePath) {
  throw new Error(`没有找到可用的 Chrome/Edge。已检查：${browserCandidates.join(', ')}`)
}

await mkdir(evidenceDir, { recursive: true })

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
})

const results = []

function expect(condition, message) {
  if (!condition) throw new Error(message)
}

async function auditView({ name, viewport, theme, screenshot, interactive = false }) {
  const context = await browser.newContext({
    viewport,
    colorScheme: theme,
    reducedMotion: 'no-preference',
  })

  await context.addInitScript((preferredTheme) => {
    localStorage.setItem('openbrowser-lab-theme', preferredTheme)
  }, theme)

  const page = await context.newPage()
  const consoleErrors = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => consoleErrors.push(error.message))

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => window.__OPENBROWSER_LAB_READY__ === true)

  expect(await page.locator('h1').isVisible(), `${name}: h1 不可见`)
  expect((await page.locator('[data-layer-id]').count()) === 5, `${name}: 架构层数量不是 5`)
  expect((await page.locator('[data-step-id]').count()) === 6, `${name}: 生命周期步骤不是 6`)
  expect((await page.locator('[data-scenario-id]').count()) === 4, `${name}: 未来场景数量不是 4`)
  expect((await page.locator('.boundary-card').count()) === 3, `${name}: 隔离边界卡片不是 3`)
  expect((await page.locator('.audit-grid article').count()) === 3, `${name}: 审计发现不是 3`)
  expect((await page.locator('.source-links a').count()) === 4, `${name}: 一手来源链接不是 4`)

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
  expect(layout.externalResources.length === 0, `${name}: 存在外部运行时资源 ${layout.externalResources}`)

  if (interactive) {
    await page.locator('[data-layer-id="control"]').click()
    expect(
      (await page.locator('[data-layer-id="control"]').getAttribute('aria-selected')) === 'true',
      `${name}: 控制层选中状态错误`,
    )
    expect((await page.locator('#layer-panel').innerText()).includes('Local API'), `${name}: 控制层内容未更新`)

    await page.locator('[data-layer-id="product"]').focus()
    await page.keyboard.press('ArrowDown')
    expect(
      (await page.evaluate(() => document.activeElement?.dataset.layerId)) === 'control',
      `${name}: 架构层方向键焦点失败`,
    )

    await page.locator('[data-step-id="discover"]').click()
    expect(
      (await page.locator('#lifecycle-panel').innerText()).includes('DevToolsActivePort'),
      `${name}: 生命周期步骤内容未更新`,
    )

    await page.locator('[data-scenario-id="rpa"]').click()
    expect(
      (await page.locator('#value-panel').innerText()).includes('严格状态机'),
      `${name}: 未来场景内容未更新`,
    )

    await themeToggleTest(page, theme)
  }

  await page.addScriptTag({ content: axe.source })
  const axeResults = await page.evaluate(async () => {
    const result = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    })
    return result.violations.map((item) => ({
      id: item.id,
      impact: item.impact,
      nodes: item.nodes.length,
      targets: item.nodes.map((node) => node.target),
    }))
  })

  expect(axeResults.length === 0, `${name}: Axe 检出 ${JSON.stringify(axeResults)}`)
  expect(consoleErrors.length === 0, `${name}: 控制台错误 ${JSON.stringify(consoleErrors)}`)

  if (screenshot) {
    await page.evaluate(() => scrollTo(0, 0))
    await page.waitForTimeout(100)
    await page.screenshot({ path: resolve(evidenceDir, screenshot), fullPage: false })
  }

  results.push({ name, viewport, theme, layout, axeViolations: axeResults.length, consoleErrors })
  await context.close()
}

async function themeToggleTest(page, initialTheme) {
  const targetTheme = initialTheme === 'dark' ? 'light' : 'dark'
  await page.locator('.theme-toggle').click()
  expect(
    (await page.locator('html').getAttribute('data-theme')) === targetTheme,
    `主题按钮没有切换到 ${targetTheme}`,
  )
  expect(
    (await page.locator('.theme-toggle').getAttribute('aria-pressed')) === String(targetTheme === 'dark'),
    '主题按钮 aria-pressed 未同步',
  )
  await page.locator('.theme-toggle').click()
}

try {
  await auditView({
    name: 'desktop-light',
    viewport: { width: 1440, height: 1000 },
    theme: 'light',
    screenshot: 'web-demo-1440-light.png',
    interactive: true,
  })
  await auditView({
    name: 'desktop-dark',
    viewport: { width: 1440, height: 1000 },
    theme: 'dark',
    screenshot: 'web-demo-1440-dark.png',
  })
  await auditView({
    name: 'tablet-light',
    viewport: { width: 768, height: 900 },
    theme: 'light',
  })
  await auditView({
    name: 'mobile-light',
    viewport: { width: 390, height: 844 },
    theme: 'light',
    screenshot: 'web-demo-390-light.png',
  })

  const reducedContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  })
  const reducedPage = await reducedContext.newPage()
  await reducedPage.goto(baseUrl, { waitUntil: 'networkidle' })
  await reducedPage.waitForFunction(() => window.__OPENBROWSER_LAB_READY__ === true)
  const reducedMotion = await reducedPage.evaluate(() => ({
    matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    transitionDuration: Number.parseFloat(getComputedStyle(document.querySelector('.stage-node')).transitionDuration),
  }))
  expect(reducedMotion.matches, 'reduced-motion 媒体查询没有生效')
  expect(reducedMotion.transitionDuration <= 0.001, `reduced-motion 过渡仍过长：${reducedMotion.transitionDuration}s`)
  results.push({ name: 'reduced-motion', reducedMotion })
  await reducedContext.close()

  const noScriptContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: false,
  })
  const noScriptPage = await noScriptContext.newPage()
  await noScriptPage.goto(baseUrl, { waitUntil: 'networkidle' })
  const noScriptState = await noScriptPage.evaluate(() => ({
    text: document.querySelector('.noscript-shell')?.innerText ?? '',
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  expect(noScriptState.text.includes('真实 Chromium'), '无 JavaScript 摘要缺少核心定位')
  expect(noScriptState.text.includes('后期什么时候值得继续研究'), '无 JavaScript 摘要缺少后期价值')
  expect(noScriptState.scrollWidth <= noScriptState.clientWidth + 1, '无 JavaScript 手机视口出现横向溢出')
  results.push({ name: 'noscript-mobile', noScriptState })
  await noScriptContext.close()

  process.stdout.write(`${JSON.stringify({ ok: true, baseUrl, browser: chromePath, results }, null, 2)}\n`)
} finally {
  await browser.close()
}
