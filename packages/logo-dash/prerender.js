import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

// Cached production assets
const templateHtml = fs.readFileSync('./dist/static/index.html', 'utf-8')

// Serve HTML
try {

    // 动态获取所有支持的语言
    const localesDir = path.resolve(__dirname, 'src/i18n/locales')
    const languages = fs.readdirSync(localesDir).filter(name => {
        const fullPath = path.join(localesDir, name)
        return fs.statSync(fullPath).isDirectory()
    })

    // 为每种语言生成路由
    const routes = ['/'].concat(languages.filter(lang => lang !== 'en').map(lang => `/${lang}`))

    /** @type {string} */
    let template = templateHtml
    /** @type {import('./src/entry-server.js').render} */
    let render = (await import('./dist/server/entry-server.js')).render

    for (const route of routes) {
                // 确定当前路由的语言
        const lang = route === '/' ? 'en' : route.split('/')[1]

        const rendered = await render(route, languages)



        const html = template
            .replace(`<!--app-head-->`, rendered.head ?? '')
            .replace(`<!--app-html-->`, rendered.html ?? '')
            .replace(/<html([^>]*)>/, (match, attrs) => {
                // 检查 attrs 中是否已经存在 lang 属性
                if (attrs && /\blang\s*=/.test(attrs)) {
                    // 如果存在 lang 属性，替换其值
                    return `<html${attrs.replace(/\blang\s*=\s*(["'])[^"']*\1/, `lang="${lang}"`)}>`
                } else {
                    // 如果不存在 lang 属性，添加 lang 属性
                    return `<html${attrs ? ` ${attrs}` : ''} lang="${lang}">`
                }
            })

        const filePath = `dist/static${route}/index.html`
        const dir = path.dirname(toAbsolute(filePath))
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        fs.writeFileSync(toAbsolute(filePath), html)
        console.log(`Prerendered ${filePath} with lang="${lang}"`)
    }

} catch (e) {
    console.log(e.stack)
}

