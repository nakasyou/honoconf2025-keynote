import { Hono } from 'hono'
import { sValidator } from '@hono/standard-validator'
import * as z from 'zod'
import { hc } from 'hono/client'

const app = new Hono()
  .post('/a/b/c/d/0', sValidator('json', z.object({ name: z.string() })), (c) => c.json({
    a: {
      b: {
        c: 0
      }
    }
  }))
  .post('/a/b/c/d/1', sValidator('json', z.object({ name: z.string() })), (c) => c.json({
    a: {
      b: {
        c: 0
      }
    }
  }))
  .post('/a/b/c/d/2', sValidator('json', z.object({ name: z.string() })), (c) => c.json({
    a: {
      b: {
        c: 0
      }
    }
  }))
  .post('/a/b/c/d/3', sValidator('json', z.object({ name: z.string() })), (c) => c.json({
    a: {
      b: {
        c: 0
      }
    }
  }))
  .post('/a/b/c/d/4', sValidator('json', z.object({ name: z.string() })), (c) => c.json({
    a: {
      b: {
        c: 0
      }
    }
  }))
  .post('/a/b/c/d/5', sValidator('json', z.object({ name: z.string() })), (c) => c.json({
    a: {
      b: {
        c: 0
      }
    }
  }))
  .post('/a/b/c/d/6', sValidator('json', z.object({ name: z.string() })), (c) => c.json({
    a: {
      b: {
        c: 0
      }
    }
  }))
  .post('/a/b/c/d/7', sValidator('json', z.object({ name: z.string() })), (c) => c.json({
    a: {
      b: {
        c: 0
      }
    }
  }))
  .post('/a/b/c/d/8', sValidator('json', z.object({ name: z.string() })), (c) => c.json({
    a: {
      b: {
        c: 0
      }
    }
  }))
  .post('/a/b/c/d/9', sValidator('json', z.object({ name: z.string() })), (c) => c.json({
    a: {
      b: {
        c: 0
      }
    }
  }))

const client = hc<typeof app>('/')

client.a.b.c.d[0].$post({
  json: { name: 'hono' }
}).then(r => r.json()).then(r => r.a.b.c satisfies number)
