import { edenTreaty } from "@elysiajs/eden";
import { Elysia, t } from "elysia";

const app = new Elysia()
  .post("/a/b/c/d/0", (c) => ({
    a: {
      b: {
        c: 0,
      },
    },
  }), {
    body: t.Object({
      name: t.String(),
    }),
  })
  .post("/a/b/c/d/1", (c) => ({
    a: {
      b: {
        c: 0,
      },
    },
  }), {
    body: t.Object({
      name: t.String(),
    }),
  })
  .post("/a/b/c/d/2", (c) => ({
    a: {
      b: {
        c: 0,
      },
    },
  }), {
    body: t.Object({
      name: t.String(),
    }),
  })
  .post("/a/b/c/d/3", (c) => ({
    a: {
      b: {
        c: 0,
      },
    },
  }), {
    body: t.Object({
      name: t.String(),
    }),
  })
  .post("/a/b/c/d/4", (c) => ({
    a: {
      b: {
        c: 0,
      },
    },
  }), {
    body: t.Object({
      name: t.String(),
    }),
  })
  .post("/a/b/c/d/5", (c) => ({
    a: {
      b: {
        c: 0,
      },
    },
  }), {
    body: t.Object({
      name: t.String(),
    }),
  })
  .post("/a/b/c/d/6", (c) => ({
    a: {
      b: {
        c: 0,
      },
    },
  }), {
    body: t.Object({
      name: t.String(),
    }),
  })
  .post("/a/b/c/d/7", (c) => ({
    a: {
      b: {
        c: 0,
      },
    },
  }), {
    body: t.Object({
      name: t.String(),
    }),
  })
  .post("/a/b/c/d/8", (c) => ({
    a: {
      b: {
        c: 0,
      },
    },
  }), {
    body: t.Object({
      name: t.String(),
    }),
  })
  .post("/a/b/c/d/9", (c) => ({
    a: {
      b: {
        c: 0,
      },
    },
  }), {
    body: t.Object({
      name: t.String(),
    }),
  });

const client = edenTreaty<typeof app>("/");

client.a.b.c.d[0].post({ name: "hello" }).then((r) =>
  r.data?.a.b.c satisfies number | undefined
);
