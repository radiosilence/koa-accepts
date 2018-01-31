import { accepts } from '../src'
import * as yaml from 'js-yaml'
import * as msgpack from 'msgpack-lite'

const nxt = () => null

describe('accepts', () => {
    it('block', () => {
        console.log('blah')
        expect(1).toEqual(1)
    })
    it('should not do anything for a json request', async () => {
        const ctx: any = {
            headers: { accept: 'application/json' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.body).toMatchObject({ hi: 'ho' })
    })

    it('should ignore string', async () => {
        const ctx: any = {
            body: 'hello',
            headers: {},
        }
        await accepts()(ctx, nxt)
        expect(ctx.body).toEqual('hello')
    })

    it('should encode yaml', async () => {
        const ctx: any = {
            headers: { accept: 'application/yaml' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/yaml')
        expect(ctx.body).toEqual(yaml.safeDump({ hi: 'ho' }))
    })

    it('should encode msgpac', async () => {
        const ctx: any = {
            headers: { accept: 'application/x-msgpack' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/x-msgpack')
        expect(ctx.body).toEqual(msgpack.encode({ hi: 'ho' }))
    })

})