import { AvailableTypes } from './interfaces'

import * as yaml from 'js-yaml'
import * as msgpack from 'msgpack-lite'

export const AVAILABLE_TYPES: AvailableTypes = {
    'application/yaml': (body: object) => yaml.safeDump(body),
    'application/x-msgpack': (body: object) => msgpack.encode(body),
    'application/json': (body: object) => JSON.stringify(body),
}