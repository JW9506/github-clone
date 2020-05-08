class RedisSessionStore {
  constructor(client) {
    this.client = client
  }
  // get session data from redis
  async get(sid) {
    console.log("get(sid)", sid)
    const id = getRedisSessionId(sid)
    const data = await this.client.get(id)
    if (!data) {
      return null
    }
    let result = {}
    try {
      result = JSON.parse(data)
    } catch (error) {
      console.error(error)
    }
    return result
  }

  // save session data to redis
  async set(sid, sessContent, ttl) {
    console.log("async set(sid, sessContent, ttl)", sid, sessContent, ttl)
    const id = getRedisSessionId(sid)
    if (typeof ttl === "number") {
      ttl = Math.ceil(ttl / 1000)
    }
    try {
      const sessStr = JSON.stringify(sessContent)
      if (ttl) {
        await this.client.setex(id, ttl, sessStr)
      } else {
        await this.client.set(id, sessStr)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // kill a sid in redis
  async destroy(sid) {
    console.log("async destroy(sid)", sid)
    const id = getRedisSessionId(sid)
    await this.client.del(id)
  }
}

function getRedisSessionId(sid) {
  return `ssid:${sid}`
}

module.exports = RedisSessionStore
