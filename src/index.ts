import { Context } from 'koa'
import * as yaml from 'js-yaml'
import * as msgpack from 'msgpack-lite'
import { mediaTypes } from 'accept'

export const accepts = () => async (ctx: Context, next: () => void): Promise<void> => {
    await next()

    if (typeof ctx.body === 'string') return

    // Parse using accept lib to process the weightings
    const accept = mediaTypes(ctx.headers.accept)

    // Remove "undefined" values
    const safeBody = JSON.parse(JSON.stringify(ctx.body))

    for (let idx = 0; idx < accept.length; idx++) {
        const mediaType = accept[idx]

        // YAML
        if (mediaType === 'application/yaml') {
            ctx.type = 'application/yaml'
            ctx.body = yaml.safeDump(safeBody)
            break
        }

        // MessagePack
        if (mediaType === 'application/x-msgpack') {
            ctx.type = 'application/x-msgpack'
            ctx.body = msgpack.encode(safeBody)
            break
        }

    }
}