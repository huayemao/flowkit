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

    // 获取pages目录下的所有页面文件
    const pagesDir = path.resolve(__dirname, 'src/pages')
    const pageFiles = fs.existsSync(pagesDir) ? fs.readdirSync(pagesDir) : []
    const pageRoutes = pageFiles
        .filter(file => file.endsWith('.tsx') && !file.startsWith('_'))
        .map(file => `/${file.replace('.tsx', '')}`)
    
    // 生成所有需要预渲染的路由
    let routes = ['/'] // 默认英文首页
    
    // 添加非英文语言的首页路由
    languages.filter(lang => lang !== 'en').forEach(lang => {
        routes.push(`/${lang}`)
    })
    
    // 添加所有页面的英文路由
    routes = routes.concat(pageRoutes)
    
    // 添加所有页面的非英文语言路由
    languages.filter(lang => lang !== 'en').forEach(lang => {
        pageRoutes.forEach(pageRoute => {
            routes.push(`/${lang}${pageRoute}`)
        })
    })

    /** @type {string} */
    let template = templateHtml
    /** @type {import('./src/entry-server.js').render} */
    let render = (await import('./dist/server/entry-server.js')).render

    for (const route of routes) {
        // 确定当前路由的语言
        let lang = 'en' // 默认英文
        let pathSegments = route.split('/').filter(segment => segment)
        
        // 检查路由是否包含语言代码前缀
        if (pathSegments.length > 0 && languages.includes(pathSegments[0])) {
            lang = pathSegments[0]
        }

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

