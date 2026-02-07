import { cookies } from "next/headers"

const COOKIE_NAME = "privacy-client-id"

export async function getPrivacyClientId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value ?? null
}
