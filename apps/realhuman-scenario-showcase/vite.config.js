import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { defineConfig } from 'vite'

const deployBase = (() => {
  const value = process.env.REALHUMAN_DEPLOY_BASE || '/'
  return `/${value.replace(/^\/+|\/+$/g, '')}${value === '/' ? '' : '/'}`
})()

function walkFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name)
    return entry.isDirectory() ? walkFiles(file) : [file]
  })
}

function rewriteFrozenRuntimePaths() {
  if (deployBase === '/') return
  const outputRoot = resolve(import.meta.dirname, 'dist')
  const runtimeFiles = [
    resolve(outputRoot, 'engine/r34/index.html'),
    ...walkFiles(resolve(outputRoot, 'assets')).filter((file) => extname(file) === '.js'),
  ]

  runtimeFiles.forEach((file) => {
    const source = readFileSync(file, 'utf8')
    const rewritten = source
      .replace(/(["'`])\/(assets|models)\//g, `$1${deployBase}$2/`)
      .replace(/(["'`])\.\.\/models\//g, `$1${deployBase}models/`)
    if (rewritten !== source) writeFileSync(file, rewritten)
  })
}

export default defineConfig({
  base: deployBase,
  plugins: [{
    name: 'realhuman-pages-runtime-paths',
    closeBundle: rewriteFrozenRuntimePaths,
  }],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        photo: resolve(import.meta.dirname, 'photo.html'),
        video: resolve(import.meta.dirname, 'video.html'),
        extensions: resolve(import.meta.dirname, 'extensions.html'),
      },
    },
  },
})
