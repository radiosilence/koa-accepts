import { accepts } from '../src'
import * as yaml from 'js-yaml'
import * as msgpack from 'msgpack-lite'

const nxt = () => null

describe('accepts', () => {

    it('should not do anything for a json request', async () => {
        const ctx: any = {
            headers: { accept: 'application/json' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.body).toMatchObject({ hi: 'ho' })
    })

    it('should not do anything for a */* request', async () => {
        const ctx: any = {
            headers: {},
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

    it('should encode msgpack', async () => {
        const ctx: any = {
            headers: { accept: 'application/x-msgpack' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/x-msgpack')
        expect(ctx.body).toEqual(msgpack.encode({ hi: 'ho' }))
    })

    it('should respect msgpack priority', async () => {
        const ctx: any = {
            headers: { accept: 'application/yaml;q=0.1, application/x-msgpack;q=1.0' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/x-msgpack')
        expect(ctx.body).toEqual(msgpack.encode({ hi: 'ho' }))
    })

    it('should respect yaml priority', async () => {
        const ctx: any = {
            headers: { accept: 'application/x-msgpack;q=0.1, application/yaml;q=1.0' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/yaml')
        expect(ctx.body).toEqual(yaml.safeDump({ hi: 'ho' }))
    })

    it('should respect order priority', async () => {
        const ctx: any = {
            headers: { accept: 'application/x-msgpack;q=1.0, application/yaml;q=1.0' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/x-msgpack')
        expect(ctx.body).toEqual(msgpack.encode({ hi: 'ho' }))
    })

    it('should respect order priority', async () => {
        const ctx: any = {
            headers: { accept: 'application/yaml;q=1.0, application/x-msgpack;q=1.0,' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/yaml')
        expect(ctx.body).toEqual(yaml.safeDump({ hi: 'ho' }))
    })

})