import { AvailableTypes } from './interfaces'

import * as yaml from 'js-yaml'
import * as msgpack from 'msgpack-lite'
import * as xml from 'jsontoxml'

export const AVAILABLE_TYPES: AvailableTypes = {
    'application/yaml': yaml.safeDump,
    'application/x-msgpack': msgpack.encode,
    'application/json': JSON.stringify,
    'application/xml': xml,
    'text/xml': xml,
}