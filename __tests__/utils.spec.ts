import { clean } from '../src/utils'

describe('clean', () => {

    it('should leave objects alone', () => {
        expect(clean({ a: 'b' })).toMatchObject({ a: 'b' })
    })

    it('should clean shallow undefined', () => {
        expect(clean({ a: 'b', c: undefined })).toMatchObject({ a: 'b' })
    })

    it('should not clean falsey values', () => {
        expect(clean({ a: '', b: null, c: false, d: 0, e: [], f: undefined })).toMatchObject({ a: '', b: null, c: false, d: 0, e: [] })
    })

    it('should clean deep', () => {
        expect(clean({ a: { b: { c: 1, d: undefined }, e: undefined }, f: undefined })).toMatchObject({ a: { b: { c: 1 } } })
    })

    it('should remove unserializable objects', () => {
        expect(clean({ a: () => 'a' })).toMatchObject({})
    })

    it('should preserve types', () => {
        expect(clean({ a: 'a', b: 1 })).toMatchObject({ a: 'a', b: 1 })
    })

    it('should do throw error on circular objects', () => {
        const a = { b: {} }
        const c = { a }
        a.b = c
        expect(() => clean(a)).toThrowError()
    })

})