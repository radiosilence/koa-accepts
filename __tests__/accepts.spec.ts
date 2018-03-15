import accepts from '../src'
import * as yaml from 'js-yaml'
import * as msgpack from 'msgpack-lite'

const xml = require('jsontoxml')

const nxt = () => null

describe('accepts', () => {

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

    it('should encode json', async () => {
        const ctx: any = {
            headers: { accept: 'application/json' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/json')
        expect(ctx.body).toEqual(JSON.stringify({ hi: 'ho' }))
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

    it('should encode xml', async () => {
        const ctx: any = {
            headers: { accept: 'application/xml' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/xml')
        expect(ctx.body).toEqual(xml({ hi: 'ho' }))
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

    it('should respect order priority msgpack vs yaml', async () => {
        const ctx: any = {
            headers: { accept: 'application/x-msgpack;q=1.0, application/yaml;q=1.0' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/x-msgpack')
        expect(ctx.body).toEqual(msgpack.encode({ hi: 'ho' }))
    })

    it('should respect order priority yaml vs msgpack', async () => {
        const ctx: any = {
            headers: { accept: 'application/yaml;q=1.0, application/x-msgpack;q=1.0,' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/yaml')
        expect(ctx.body).toEqual(yaml.safeDump({ hi: 'ho' }))
    })

    it('should respect order priority json vs msgpack', async () => {
        const ctx: any = {
            headers: { accept: 'application/json;q=1.0, application/x-msgpack;q=0.2,' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/json')
        expect(ctx.body).toEqual(JSON.stringify({ hi: 'ho' }))
    })

    it('should respect order priority json vs yaml', async () => {
        const ctx: any = {
            headers: { accept: 'application/json;q=1.0, application/yaml;q=0.2,' },
            body: { hi: 'ho' },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/json')
        expect(ctx.body).toEqual(JSON.stringify({ hi: 'ho' }))
    })

    it('should strip undefined values from json', async () => {
        const ctx: any = {
            headers: { accept: 'application/json' },
            body: { hi: 'ho', potato: undefined, foo: { whee: undefined, a: 1 } },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/json')
        expect(ctx.body).toEqual(JSON.stringify({ hi: 'ho', foo: { a: 1 } }))
    })

    it('should strip undefined values from yaml', async () => {
        const ctx: any = {
            headers: { accept: 'application/yaml' },
            body: { hi: 'ho', potato: undefined, foo: { whee: undefined, a: 1 } },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/yaml')
        expect(ctx.body).toEqual(yaml.safeDump({ hi: 'ho', foo: { a: 1 } }))
    })

    it('should strip undefined values from msgpack', async () => {
        const ctx: any = {
            headers: { accept: 'application/x-msgpack' },
            body: { hi: 'ho', potato: undefined, foo: { whee: undefined, a: 1 } },
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/x-msgpack')
        expect(ctx.body).toEqual(msgpack.encode({ hi: 'ho', foo: { a: 1 } }))
    })

    it('should encode yaml dates properly', async () => {
        const now = new Date()
        const ctx: any = {
            headers: { accept: 'application/yaml' },
            body: { now },
        }

        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/yaml')
        expect(ctx.body).toEqual(yaml.safeDump({ now: now.toISOString() }))
    })

    it('should handle undefined values gracefully by doing nothing', async () => {
        const ctx: any = {
            headers: { accept: 'application/yaml' },
            body: undefined,
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual(undefined)
        expect(ctx.body).toEqual(undefined)
    })

    it('should handle string values gracefully by doing nothing', async () => {
        const ctx: any = {
            headers: { accept: 'application/yaml' },
            body: 'hello',
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual(undefined)
        expect(ctx.body).toEqual('hello')
    })

    it('should handle number values gracefully by doing nothing', async () => {
        const ctx: any = {
            headers: { accept: 'application/yaml' },
            body: 1.0,
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual(undefined)
        expect(ctx.body).toEqual(1.0)
    })

    it('should handle null values in yaml', async () => {
        const ctx: any = {
            headers: { accept: 'application/yaml' },
            body: null,
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/yaml')
        expect(ctx.body).toEqual(yaml.safeDump(null))
    })

    it('should handle null values in json', async () => {
        const ctx: any = {
            headers: { accept: 'application/json' },
            body: null,
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/json')
        expect(ctx.body).toEqual(JSON.stringify(null))
    })

    it('should handle null values in msgpack', async () => {
        const ctx: any = {
            headers: { accept: 'application/x-msgpack' },
            body: null,
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/x-msgpack')
        expect(ctx.body).toEqual(msgpack.encode(null))
    })

    it('should handle null values in xml', async () => {
        const ctx: any = {
            headers: { accept: 'application/xml' },
            body: null,
        }
        await accepts()(ctx, nxt)
        expect(ctx.type).toEqual('application/xml')
        expect(ctx.body).toEqual(xml(null))
    })
})