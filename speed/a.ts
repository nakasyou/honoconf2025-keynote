import { Hono } from 'hono'
import { sValidator } from '@hono/standard-validator'
import * as v from 'valibot'

const app = new Hono()

app.use(sValidator('json', v.object({ page: v.number() })))

app.get('/', c => c.text('Hello, Hono!'))

export default app
