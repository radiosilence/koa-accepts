import { intersection } from 'lodash'
import { Context } from 'koa'
import * as Negotiator from 'negotiator'

export * from './interfaces'
export * from './utils'

import { AVAILABLE_TYPES } from './constants'
import { AvailableTypes } from './interfaces'
import { clean } from './utils'

export default () => async (ctx: Context, next: () => void): Promise<void> => {
    await next()

    if (ctx.body instanceof Buffer || typeof ctx.body !== 'object') return

    // Parse using negotiator to process the weightings
    const negotiator = new Negotiator(ctx)

    // Select the top contender for requested media types and ones we can offer
    const mediaType: keyof AvailableTypes | undefined = intersection(
        negotiator.mediaTypes(),
        Object.keys(AVAILABLE_TYPES),
    )[0]

    if (mediaType !== undefined) {
        ctx.type = mediaType
        ctx.body = AVAILABLE_TYPES[mediaType](clean(ctx.body))
    }
}