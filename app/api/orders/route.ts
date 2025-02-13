import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const orders = await prisma.order.findMany()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const order = await prisma.order.create({ data })
    return NextResponse.json(order)
  } catch (error) {
    console.error("Failed to create order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

