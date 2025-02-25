"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import type { InventoryItem } from "@/types/inventory"

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [newItem, setNewItem] = useState<Omit<InventoryItem, "id" | "createdAt" | "updatedAt">>({
    sku: "",
    name: "",
    manufacturer: "",
    quantity: 0,
    location: "",
  })
  const [editItem, setEditItem] = useState<InventoryItem | null>(null)
  const [writeOffItem, setWriteOffItem] = useState<InventoryItem | null>(null)
  const [notification, setNotification] = useState({ show: false, title: "", message: "" })

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/inventory")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setInventoryItems(data)
    } catch (error) {
      console.error("Failed to fetch inventory:", error)
      setNotification({
        show: true,
        title: "Error",
        message: "Failed to fetch inventory. Please try again later.",
      })
      setTimeout(() => setNotification({ show: false, title: "", message: "" }), 5000)
    }
  }

  const filteredInventory = inventoryItems.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (manufacturer === "all" || manufacturer === "" || item.manufacturer === manufacturer),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: name === "quantity" ? Number(value) : value }))
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditItem((prev) => prev && { ...prev, [name]: name === "quantity" ? Number(value) : value })
  }

  const handleAddItem = async () => {
    const response = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    })
    if (response.ok) {
      fetchInventory()
      setNewItem({ sku: "", name: "", manufacturer: "", quantity: 0, location: "" })
      setNotification({
        show: true,
        title: "Item added",
        message: `${newItem.name} has been successfully added to the inventory.`,
      })
      setTimeout(() => setNotification({ show: false, title: "", message: "" }), 3000)
    }
  }

  const handleEditItem = async () => {
    if (!editItem) return
    try {
      const response = await fetch("/api/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem),
      })
      if (response.ok) {
        fetchInventory()
        setEditItem(null)
        showNotification("Item updated", `${editItem.name} has been successfully updated.`)
      } else {
        throw new Error("Failed to update item")
      }
    } catch (error) {
      console.error("Failed to update item:", error)
      showNotification("Error", "Failed to update item. Please try again.")
    }
  }

  const handleWriteOffItem = async () => {
    if (!writeOffItem) return
    try {
      const response = await fetch("/api/inventory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: writeOffItem.id }),
      })
      if (response.ok) {
        fetchInventory()
        setWriteOffItem(null)
        showNotification("Item written off", `${writeOffItem.name} has been successfully written off.`)
      } else {
        throw new Error("Failed to write off item")
      }
    } catch (error) {
      console.error("Failed to write off item:", error)
      showNotification("Error", "Failed to write off item. Please try again.")
    }
  }

  const showNotification = (title: string, message: string) => {
    setNotification({ show: true, title, message })
    setTimeout(() => setNotification({ show: false, title: "", message: "" }), 3000)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Управление инвентарем</h1>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Input
            placeholder="Поиск по названию или SKU"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={manufacturer} onValueChange={setManufacturer}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Производитель" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все производители</SelectItem>
              {Array.from(new Set(inventoryItems.map((item) => item.manufacturer))).map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Добавить товар</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Добавить новый товар</DialogTitle>
                <DialogDescription>
                  Заполните информацию о новом товаре здесь. Нажмите Добавить, когда закончите.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sku" className="text-right">
                    SKU
                  </Label>
                  <Input id="sku" name="sku" value={newItem.sku} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Название
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={newItem.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="manufacturer" className="text-right">
                    Производитель
                  </Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    value={newItem.manufacturer}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">
                    Количество
                  </Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Расположение
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={newItem.location}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleAddItem}>Добавить товар</Button>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список инвентаря</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Производитель</TableHead>
                <TableHead>Количество</TableHead>
                <TableHead>Расположение</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.manufacturer}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => setEditItem(item)}>
                          Редактировать
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Редактировать товар</DialogTitle>
                          <DialogDescription>
                            Измените информацию о товаре здесь. Нажмите Сохранить, когда закончите.
                          </DialogDescription>
                        </DialogHeader>
                        {editItem && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-sku" className="text-right">
                                SKU
                              </Label>
                              <Input
                                id="edit-sku"
                                name="sku"
                                value={editItem.sku}
                                onChange={handleEditInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Название
                              </Label>
                              <Input
                                id="edit-name"
                                name="name"
                                value={editItem.name}
                                onChange={handleEditInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-manufacturer" className="text-right">
                                Производитель
                              </Label>
                              <Input
                                id="edit-manufacturer"
                                name="manufacturer"
                                value={editItem.manufacturer}
                                onChange={handleEditInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-quantity" className="text-right">
                                Количество
                              </Label>
                              <Input
                                id="edit-quantity"
                                name="quantity"
                                type="number"
                                value={editItem.quantity}
                                onChange={handleEditInputChange}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-location" className="text-right">
                                Расположение
                              </Label>
                              <Input
                                id="edit-location"
                                name="location"
                                value={editItem.location}
                                onChange={handleEditInputChange}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                        )}
                        <Button onClick={handleEditItem}>Сохранить изменения</Button>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setWriteOffItem(item)}>
                          Списать
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Списать товар</DialogTitle>
                          <DialogDescription>
                            Вы уверены, что хотите списать этот товар? Это действие нельзя отменить.
                          </DialogDescription>
                        </DialogHeader>
                        {writeOffItem && (
                          <div className="py-4">
                            <p>
                              Вы собираетесь списать товар: <strong>{writeOffItem.name}</strong> (SKU:{" "}
                              {writeOffItem.sku})
                            </p>
                          </div>
                        )}
                        <Button onClick={handleWriteOffItem}>Подтвердить списание</Button>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {notification.show && (
        <Alert className="fixed bottom-4 right-4 w-96">
          <AlertTitle>{notification.title}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}