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

export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json()
    const supplier = await prisma.supplier.update({
      where: { id: Number(id) },
      data,
    })
    return NextResponse.json(supplier)
  } catch (error) {
    console.error("Failed to update supplier:", error)
    return NextResponse.json({ error: "Failed to update supplier" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    await prisma.supplier.delete({
      where: { id: Number(id) },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete supplier:", error)
    return NextResponse.json({ error: "Failed to delete supplier" }, { status: 500 })
  }
}

