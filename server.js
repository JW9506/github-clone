const Koa = require("koa")
const Router = require("koa-router")
const session = require("koa-session")
const koaBody = require("koa-body")
const IORedis = require("ioredis")
const auth = require("./lib/auth")
const { default: next } = require("next")

const RedisSessionStore = require("./lib/sessionStore")
const api = require("./lib/api")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })

const handle = app.getRequestHandler()

const redis = new IORedis()

;(async () => {
  await app.prepare()
  const server = new Koa()
  // const router = new Router()

  server.keys = ["mysessionkey1995"]
  const SESSION_CONFIG = {
    key: "sess",
    maxAge: 3600 * 1000,
    store: new RedisSessionStore(redis),
  }

  server.use(koaBody())
  server.use(session(SESSION_CONFIG, server))

  auth(server)
  api(server)

  // server.use(router.routes())

  server.use(async (ctx, next) => {
    ctx.req.session = ctx.session
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => {
    console.log("Koa waiting on 3000")
  })
})()
