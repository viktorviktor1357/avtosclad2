import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const inventoryItems = await prisma.inventoryItem.findMany()
    return NextResponse.json(inventoryItems)
  } catch (error) {
    console.error("Failed to fetch inventory items:", error)
    return NextResponse.json({ error: "Failed to fetch inventory items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const item = await prisma.inventoryItem.create({ data })
    return NextResponse.json(item)
  } catch (error) {
    console.error("Failed to create inventory item:", error)
    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json()
    const item = await prisma.inventoryItem.update({
      where: { id },
      data,
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error("Failed to update inventory item:", error)
    return NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.inventoryItem.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete inventory item:", error)
    return NextResponse.json({ error: "Failed to delete inventory item" }, { status: 500 })
  }
}

