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
import { Textarea } from "@/components/ui/textarea"

const orders = [
  { id: 1, orderNumber: "ORD-001", customer: "АвтоМир", status: "Новый", items: 5, total: 1500 },
  { id: 2, orderNumber: "ORD-002", customer: "СервисПлюс", status: "В обработке", items: 3, total: 800 },
  { id: 3, orderNumber: "ORD-003", customer: "МастерДеталь", status: "Отправлен", items: 7, total: 2200 },
  { id: 4, orderNumber: "ORD-004", customer: "АвтоЗапчасть", status: "Новый", items: 2, total: 350 },
  { id: 5, orderNumber: "ORD-005", customer: "ТехноСервис", status: "В обработке", items: 4, total: 1100 },
]

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [comment, setComment] = useState("")

  const filteredOrders = orders.filter(
    (order) =>
      (order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (status === "all" || status === "" || order.status === status),
  )

  const handleStatusChange = (orderId, newStatus) => {
    // В реальном приложении здесь был бы API-запрос для обновления статуса
    console.log(`Изменение статуса заказа ${orderId} на ${newStatus}`)
  }

  const handleCommentSubmit = (orderId) => {
    // В реальном приложении здесь был бы API-запрос для добавления комментария
    console.log(`Добавление комментария к заказу ${orderId}: ${comment}`)
    setComment("")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Управление заказами</h1>

      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Input
            placeholder="Поиск по номеру заказа или клиенту"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="Новый">Новый</SelectItem>
              <SelectItem value="В обработке">В обработке</SelectItem>
              <SelectItem value="Отправлен">Отправлен</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список заказов</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер заказа</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Кол-во товаров</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <Select value={order.status} onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue>{order.status}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Новый">Новый</SelectItem>
                        <SelectItem value="В обработке">В обработке</SelectItem>
                        <SelectItem value="Отправлен">Отправлен</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.total} ₽</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          Детали
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Детали заказа {selectedOrder?.orderNumber}</DialogTitle>
                          <DialogDescription>Информация о заказе и возможность добавить комментарий.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="customer" className="text-right">
                              Клиент
                            </Label>
                            <Input id="customer" value={selectedOrder?.customer} className="col-span-3" readOnly />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              Статус
                            </Label>
                            <Input id="status" value={selectedOrder?.status} className="col-span-3" readOnly />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="items" className="text-right">
                              Кол-во товаров
                            </Label>
                            <Input id="items" value={selectedOrder?.items} className="col-span-3" readOnly />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="total" className="text-right">
                              Сумма
                            </Label>
                            <Input id="total" value={`${selectedOrder?.total} ₽`} className="col-span-3" readOnly />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="comment" className="text-right">
                              Комментарий
                            </Label>
                            <Textarea
                              id="comment"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <Button onClick={() => handleCommentSubmit(selectedOrder?.id)}>Добавить комментарий</Button>
                      </DialogContent>
                    </Dialog>
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

