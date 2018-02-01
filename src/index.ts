import { intersection } from 'lodash'

import { Context } from 'koa'
import * as yaml from 'js-yaml'
import * as msgpack from 'msgpack-lite'
import * as Negotiator from 'negotiator'

export interface AvailableTypes {
    [key: string]: (body: object) => string | Buffer
}

export const AVAILABLE_TYPES: AvailableTypes = {
    'application/yaml': (body: object) => yaml.safeDump(body),
    'application/x-msgpack': (body: object) => msgpack.encode(body),
}

export const clean = (body: object): object => JSON.parse(JSON.stringify(body))

export default () => async (ctx: Context, next: () => void): Promise<void> => {
    await next()

    if (typeof ctx.body === 'string' || ctx.body instanceof Buffer) return

    // Parse using accept lib to process the weightings
    const negotiator = new Negotiator(ctx)
    const mediaType: keyof AvailableTypes | undefined = intersection(
        negotiator.mediaTypes(),
        Object.keys(AVAILABLE_TYPES),
    )[0]

    if (mediaType === undefined) return

    ctx.body = AVAILABLE_TYPES[mediaType](clean(ctx.body))
    ctx.type = mediaType
}