import LRUCache from "lru-cache"

const repoCache = new LRUCache({
  maxAge: 60 * 60 * 1000,
})

export function cache(repo) {
  repoCache.set(repo.full_name, repo)
}

export function get(fullName) {
  return repoCache.get(fullName)
}

export function cacheArray(repos) {
  if (repos && Array.isArray(repos)) {
    repos.forEach((repo) => cache(repo))
  }
}
