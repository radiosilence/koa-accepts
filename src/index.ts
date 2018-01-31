import { Context } from 'koa'
import * as yaml from 'js-yaml'
import * as msgpack from 'msgpack-lite'

export default () => async (ctx: Context, next: () => void) => {
    await next()
    const accept: string = ctx.headers.accept || 'application/json'
    if (typeof ctx.body === 'string') return
    const safeBody = JSON.parse(JSON.stringify(ctx.body))
    if (accept.includes('application/yaml')) {
        ctx.type = 'application/yaml'
        ctx.body = `${yaml.safeDump(safeBody)}\n`
    } else if (accept.includes('application/x-msgpack')) {
        ctx.type = 'application/x-msgpack'
        ctx.body = msgpack.encode(safeBody)
    }
}