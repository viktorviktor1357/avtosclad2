"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Supplier } from "@/types/supplier"

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, "id">>({
    name: "",
    contact: "",
    email: "",
    phone: "",
  })
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null)
  const [notification, setNotification] = useState({ show: false, title: "", message: "" })

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
      showNotification("Ошибка", "Не удалось загрузить поставщиков. Пожалуйста, попробуйте позже.")
    }
  }

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewSupplier((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditSupplier((prev) => prev && { ...prev, [name]: value })
  }

  const handleAddSupplier = async () => {
    try {
      const response = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSupplier),
      })
      if (!response.ok) {
        throw new Error("Failed to add supplier")
      }
      await fetchSuppliers()
      setNewSupplier({ name: "", contact: "", email: "", phone: "" })
      showNotification("Поставщик добавлен", `${newSupplier.name} успешно добавлен в список поставщиков.`)
    } catch (error) {
      console.error("Error adding supplier:", error)
      showNotification("Ошибка", "Не удалось добавить поставщика. Пожалуйста, попробуйте снова.")
    }
  }

  const handleEditSupplier = async () => {
    if (!editSupplier) return
    try {
      const response = await fetch("/api/suppliers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editSupplier),
      })
      if (!response.ok) {
        throw new Error("Failed to update supplier")
      }
      await fetchSuppliers()
      setEditSupplier(null)
      showNotification("Поставщик обновлен", `Информация о ${editSupplier.name} успешно обновлена.`)
    } catch (error) {
      console.error("Error updating supplier:", error)
      showNotification("Ошибка", "Не удалось обновить информацию о поставщике. Пожалуйста, попробуйте снова.")
    }
  }

  const handleDeleteSupplier = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этого поставщика?")) {
      try {
        const response = await fetch("/api/suppliers", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
        if (!response.ok) {
          throw new Error("Failed to delete supplier")
        }
        await fetchSuppliers()
        showNotification("Поставщик удален", "Поставщик успешно удален из списка.")
      } catch (error) {
        console.error("Error deleting supplier:", error)
        showNotification("Ошибка", "Не удалось удалить поставщика. Пожалуйста, попробуйте снова.")
      }
    }
  }

  const showNotification = (title: string, message: string) => {
    setNotification({ show: true, title, message })
    setTimeout(() => setNotification({ show: false, title: "", message: "" }), 3000)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Управление поставщиками</h1>

      {notification.show && (
        <Alert>
          <AlertTitle>{notification.title}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

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
          <Dialog>
            <DialogTrigger asChild>
              <Button>Добавить поставщика</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Добавить нового поставщика</DialogTitle>
                <DialogDescription>
                  Заполните информацию о новом поставщике здесь. Нажмите Добавить, когда закончите.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Название
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newSupplier.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contact" className="text-right">
                    Контактное лицо
                  </Label>
                  <Input
                    id="contact"
                    name="contact"
                    value={newSupplier.contact}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newSupplier.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Телефон
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newSupplier.phone}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleAddSupplier}>Добавить поставщика</Button>
            </DialogContent>
          </Dialog>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditSupplier(supplier)}>
                          Редактировать
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Редактировать поставщика</DialogTitle>
                          <DialogDescription>
                            Измените информацию о поставщике здесь. Нажмите Сохранить, когда закончите.
                          </DialogDescription>
                        </DialogHeader>
                        {editSupplier && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Название
                              </Label>
                              <Input
                                id="edit-name"
                                name="name"
                                value={editSupplier.name}
                                onChange={handleEditInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-contact" className="text-right">
                                Контактное лицо
                              </Label>
                              <Input
                                id="edit-contact"
                                name="contact"
                                value={editSupplier.contact}
                                onChange={handleEditInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-email" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="edit-email"
                                name="email"
                                type="email"
                                value={editSupplier.email}
                                onChange={handleEditInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-phone" className="text-right">
                                Телефон
                              </Label>
                              <Input
                                id="edit-phone"
                                name="phone"
                                value={editSupplier.phone}
                                onChange={handleEditInputChange}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                        )}
                        <Button onClick={handleEditSupplier}>Сохранить изменения</Button>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteSupplier(supplier.id)}>
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

     
    </div>
  )
}

