import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany()
    return NextResponse.json(suppliers)
  } catch (error) {
    console.error("Failed to fetch suppliers:", error)
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const supplier = await prisma.supplier.create({ data })
    return NextResponse.json(supplier)
  } catch (error) {
    console.error("Failed to create supplier:", error)
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 })
  }
}

