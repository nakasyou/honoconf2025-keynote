import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

const t = initTRPC.create();

const appRouter = t.router({
  a: t.router({
    b: t.router({
      c: t.router({
        d: t.router({
          0: t.procedure
            .input(z.object({ name: z.string() }))
            .mutation(async () => ({
              a: {
                b: {
                  c: 0,
                },
              },
            })),
          1: t.procedure
            .input(z.object({ name: z.string() }))
            .mutation(async () => ({
              a: {
                b: {
                  c: 0,
                },
              },
            })),
          2: t.procedure
            .input(z.object({ name: z.string() }))
            .mutation(async () => ({
              a: {
                b: {
                  c: 0,
                },
              },
            })),
          3: t.procedure
            .input(z.object({ name: z.string() }))
            .mutation(async () => ({
              a: {
                b: {
                  c: 0,
                },
              },
            })),
          4: t.procedure
            .input(z.object({ name: z.string() }))
            .mutation(async () => ({
              a: {
                b: {
                  c: 0,
                },
              },
            })),
          5: t.procedure
            .input(z.object({ name: z.string() }))
            .mutation(async () => ({
              a: {
                b: {
                  c: 0,
                },
              },
            })),
          6: t.procedure
            .input(z.object({ name: z.string() }))
            .mutation(async () => ({
              a: {
                b: {
                  c: 0,
                },
              },
            })),
          7: t.procedure
            .input(z.object({ name: z.string() }))
            .mutation(async () => ({
              a: {
                b: {
                  c: 0,
                },
              },
            })),
          8: t.procedure
            .input(z.object({ name: z.string() }))
            .mutation(async () => ({
              a: {
                b: {
                  c: 0,
                },
              },
            })),
          9: t.procedure
            .input(z.object({ name: z.string() }))
            .mutation(async () => ({
              a: {
                b: {
                  c: 0,
                },
              },
            })),
        }),
      }),
    }),
  }),
});

export type AppRouter = typeof appRouter;

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc', // Adjust URL as needed
    }),
  ],
});

client.a.b.c.d[0].mutate({ name: 'hello' }).then((r) =>
  r.a.b.c satisfies number | undefined
);
