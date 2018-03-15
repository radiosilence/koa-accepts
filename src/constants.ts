import { AvailableTypes } from './interfaces'

import * as yaml from 'js-yaml'
import * as msgpack from 'msgpack-lite'

export const AVAILABLE_TYPES: AvailableTypes = {
    'application/yaml': yaml.safeDump,
    'application/x-msgpack': msgpack.encode,
    'application/json': JSON.stringify,
}