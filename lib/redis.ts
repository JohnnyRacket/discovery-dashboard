import { Redis } from "@upstash/redis"

function createRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    // Return a mock client for development without Redis
    return new Proxy({} as Redis, {
      get(_, prop) {
        if (prop === "pipeline") {
          return () => ({
            exec: async () => [],
            get: () => {},
            set: () => {},
            zadd: () => {},
            zrem: () => {},
            del: () => {},
          })
        }
        if (prop === "get") return async () => null
        if (prop === "set") return async () => "OK"
        if (prop === "del") return async () => 1
        if (prop === "zrange") return async () => []
        if (prop === "zadd") return async () => 1
        if (prop === "zrem") return async () => 1
        return () => {}
      },
    })
  }

  return Redis.fromEnv()
}

export const redis = createRedis()
