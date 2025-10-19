import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createRouterClient, os, type RouterClient } from '@orpc/server'
import { z } from 'zod'

export const router = {
  a: {
    b: {
      c: {
        d: {
          0: os.input(z.object({ name: z.string() })).handler(v => ({
            a: {
              b: {
                c: 0,
              },
            },
          })),
          1: os.input(z.object({ name: z.string() })).handler(v => ({
            a: {
              b: {
                c: 0,
              },
            },
          })),
          2: os.input(z.object({ name: z.string() })).handler(v => ({
            a: {
              b: {
                c: 0,
              },
            },
          })),
          3: os.input(z.object({ name: z.string() })).handler(v => ({
            a: {
              b: {
                c: 0,
              },
            },
          })),
          4: os.input(z.object({ name: z.string() })).handler(v => ({ 
            a: {
              b: {
                c: 0,
              },
            },
          })),
          5: os.input(z.object({ name: z.string() })).handler(v => ({
            a: {
              b: {
                c: 0,
              },
            },
          })),
          6: os.input(z.object({ name: z.string() })).handler(v => ({
            a: {
              b: {
                c: 0,
              },
            },
          })),
          7: os.input(z.object({ name: z.string() })).handler(v => ({
            a: {
              b: {
                c: 0,
              },
            },
          })),
          8: os.input(z.object({ name: z.string() })).handler(v => ({
            a: {
              b: {
                c: 0,
              },
            },
          })),
          9: os.input(z.object({ name: z.string() })).handler(v => ({
            a: {
              b: {
                c: 0,
              },
            },
          })),
        },
      },
    },
  },
}

export const orpc: RouterClient<typeof router> = createORPCClient(new RPCLink({
  url: '/'
}))
orpc.a.b.c.d[0]({
  name: 'test',
}).then(r => r.a.b.c satisfies number)
