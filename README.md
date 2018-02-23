# koa-accepts

[![CircleCI](https://circleci.com/gh/radiosilence/koa-accepts.svg?style=shield)](https://circleci.com/gh/radiosilence/koa-accepts)

Simple middleware to change the format of your response based on the HTTP accept header, using q weights via the negotiator library.

Supported formats:

* `application/yaml`: YAML
* `application/x-msgpack`: MsgPack
* `application/json`: JSON.stringify
* `application/xml,text/xml`: XML

If anything else it will fall back to doing what koa normally does (JSON).

## Quickstart

```ts
import * as koa from 'koa'
import accepts from 'koa-accepts'

const app = new Koa()

app.use(accepts())
```