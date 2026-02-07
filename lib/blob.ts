import { put, del, list } from "@vercel/blob"

const REQUEST_TIMEOUT_MS = 10_000

// In-memory store for local development without a valid blob token
const memoryStore = new Map<string, string>()

function hasToken() {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

export async function getBlob<T>(url: string): Promise<T | null> {
  if (!hasToken()) {
    const data = memoryStore.get(url)
    return data ? (JSON.parse(data) as T) : null
  }
  const res = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  if (!res.ok) return null
  return (await res.json()) as T
}

export async function putBlob<T>(pathname: string, data: T): Promise<string> {
  if (!hasToken()) {
    const json = JSON.stringify(data)
    memoryStore.set(pathname, json)
    return pathname
  }
  const blob = await put(pathname, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  return blob.url
}

export async function delBlob(url: string): Promise<void> {
  if (!hasToken()) {
    memoryStore.delete(url)
    return
  }
  await del(url)
}

export async function listBlobs(prefix: string) {
  if (!hasToken()) {
    return [...memoryStore.keys()]
      .filter((k) => k.startsWith(prefix))
      .map((k) => ({ pathname: k, url: k }))
  }
  const result = await list({
    prefix,
    abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  return result.blobs
}

export async function findBlob(pathname: string) {
  if (!hasToken()) {
    if (memoryStore.has(pathname)) {
      return { pathname, url: pathname }
    }
    return null
  }
  const result = await list({
    prefix: pathname,
    abortSignal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  return result.blobs.find((b) => b.pathname === pathname) ?? null
}
