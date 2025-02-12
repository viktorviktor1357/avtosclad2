"use client"

import { useState } from "react"
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

const inventory = [
  { id: 1, sku: "BP-001", name: "Тормозные колодки", manufacturer: "Brembo", quantity: 150, location: "A1-01" },
  { id: 2, sku: "OF-002", name: "Масляный фильтр", manufacturer: "Mann-Filter", quantity: 200, location: "B2-03" },
  { id: 3, sku: "SP-003", name: "Свечи зажигания", manufacturer: "NGK", quantity: 300, location: "C3-02" },
  { id: 4, sku: "AF-004", name: "Воздушный фильтр", manufacturer: "K&N", quantity: 100, location: "A2-04" },
  { id: 5, sku: "AT-005", name: "Генератор", manufacturer: "Bosch", quantity: 50, location: "D1-01" },
]

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [manufacturer, setManufacturer] = useState("")
  const [newItem, setNewItem] = useState({
    sku: "",
    name: "",
    manufacturer: "",
    quantity: "",
    location: "",
  })
  const [inventoryItems, setInventoryItems] = useState(inventory)

  const filteredInventory = inventoryItems.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (manufacturer === "all" || manufacturer === "" || item.manufacturer === manufacturer),
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: value }))
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
              <SelectItem value="Brembo">Brembo</SelectItem>
              <SelectItem value="Mann-Filter">Mann-Filter</SelectItem>
              <SelectItem value="NGK">NGK</SelectItem>
              <SelectItem value="K&N">K&N</SelectItem>
              <SelectItem value="Bosch">Bosch</SelectItem>
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
              <Button>Добавить товар</Button>
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
                    <Button variant="outline" size="sm" className="mr-2">
                      Редактировать
                    </Button>
                    <Button variant="outline" size="sm">
                      Списать
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

