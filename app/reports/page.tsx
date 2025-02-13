"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Supplier } from "@/types/supplier"

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("/api/suppliers")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      console.error("Failed to fetch suppliers:", error)
    }
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Управление поставщиками</h1>

      <Card>
        <CardHeader>
          <CardTitle>Поиск поставщиков</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input
            placeholder="Поиск по названию или контактному лицу"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button>Добавить поставщика</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список поставщиков</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Контактное лицо</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.contact}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2">
                      Редактировать
                    </Button>
                    <Button variant="outline" size="sm">
                      Заказать
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ожидаемые поставки</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Brembo - Тормозные колодки (100 шт.) - Ожидается 15.03.2024
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Mann-Filter - Масляные фильтры (200 шт.) - Ожидается 20.03.2024
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              NGK - Свечи зажигания (300 шт.) - Ожидается 25.03.2024
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

