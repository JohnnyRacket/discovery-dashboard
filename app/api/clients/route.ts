import { NextResponse } from "next/server"
import { getAllClients, searchClients } from "@/lib/data/clients"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")
  const clients = q ? await searchClients(q) : await getAllClients()
  return NextResponse.json(clients)
}
