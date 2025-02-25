import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""

    const orders = await prisma.order.findMany({
      where: {
        AND: [
          {
            OR: [{ orderNumber: { contains: search } }, { customer: { contains: search } }],
          },
          status !== "all" ? { status } : {},
        ],
      },
    })
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

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json()
    const order = await prisma.order.update({
      where: { id: Number(id) },
      data,
    })
    return NextResponse.json(order)
  } catch (error) {
    console.error("Failed to update order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.order.delete({
      where: { id: Number(id) },
    })
    return NextResponse.json({ success: true, message: "Order completed and deleted" })
  } catch (error) {
    console.error("Failed to complete order:", error)
    return NextResponse.json({ error: "Failed to complete order" }, { status: 500 })
  }
}

