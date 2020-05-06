const Koa = require("koa")
const { default: next } = require("next")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })

const handle = app.getRequestHandler()

;(async () => {
  await app.prepare()
  const server = new Koa()
  server.use(async (ctx, next) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })
  server.listen(3000, () => {
    console.log("Koa waiting on 3000")
  })
})()
