"use client"

import { useState, useEffect, useCallback } from "react"
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
import type { Order } from "@/types/order"

export default function Management() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newOrder, setNewOrder] = useState<Omit<Order, "id" | "createdAt" | "updatedAt">>({
    orderNumber: "",
    customer: "",
    status: "Новый",
    items: 0,
    total: 0,
  })
  const [orderSearchQuery, setOrderSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState<{ show: boolean; title: string; message: string }>({
    show: false,
    title: "",
    message: "",
  })

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/orders?search=${orderSearchQuery}&status=${selectedStatus}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      showNotification("Ошибка", "Не удалось загрузить заказы. Пожалуйста, попробуйте снова.")
    } finally {
      setIsLoading(false)
    }
  }, [orderSearchQuery, selectedStatus])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleAddOrder = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      })
      if (!response.ok) {
        throw new Error("Failed to add order")
      }
      await fetchOrders()
      setNewOrder({
        orderNumber: "",
        customer: "",
        status: "Новый",
        items: 0,
        total: 0,
      })
      showNotification("Заказ добавлен", "Новый заказ успешно добавлен.")
    } catch (error) {
      console.error("Error adding order:", error)
      showNotification("Ошибка", "Не удалось добавить заказ. Пожалуйста, попробуйте снова.")
    }
  }

  const handleCompleteOrder = async (orderId: number) => {
    if (confirm("Вы уверены, что хотите завершить этот заказ? Это действие удалит заказ.")) {
      try {
        const response = await fetch(`/api/orders`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: orderId }),
        })
        if (!response.ok) {
          throw new Error("Failed to complete order")
        }
        await fetchOrders()
        showNotification("Заказ завершен", "Заказ успешно завершен и удален.")
      } catch (error) {
        console.error("Error completing order:", error)
        showNotification("Ошибка", "Не удалось завершить заказ. Пожалуйста, попробуйте снова.")
      }
    }
  }

  const handleEditOrder = async () => {
    if (!selectedOrder) return
    try {
      const response = await fetch(`/api/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedOrder),
      })
      if (!response.ok) {
        throw new Error("Failed to update order")
      }
      await fetchOrders()
      setSelectedOrder(null)
      showNotification("Заказ обновлен", "Информация о заказе успешно обновлена.")
    } catch (error) {
      console.error("Error updating order:", error)
      showNotification("Ошибка", "Не удалось обновить заказ. Пожалуйста, попробуйте снова.")
    }
  }

  const showNotification = (title: string, message: string) => {
    setNotification({ show: true, title, message })
    setTimeout(() => setNotification({ show: false, title: "", message: "" }), 3000)
  }

  const filteredOrders = orders.filter(
    (order) =>
      (order.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(orderSearchQuery.toLowerCase())) &&
      (selectedStatus === "all" || selectedStatus === "" || order.status === selectedStatus),
  )

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Управление заказами</h1>

      {notification.show && (
        <Alert>
          <AlertTitle>{notification.title}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Заказы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Input
              placeholder="Поиск по номеру заказа или клиенту"
              value={orderSearchQuery}
              onChange={(e) => setOrderSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
            <Dialog>
              <DialogTrigger asChild>
                <Button>Добавить заказ</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить новый заказ</DialogTitle>
                  <DialogDescription>
                    Заполните информацию о новом заказе здесь. Нажмите Добавить, когда закончите.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="orderNumber" className="text-right">
                      Номер заказа
                    </Label>
                    <Input
                      id="orderNumber"
                      value={newOrder.orderNumber}
                      onChange={(e) => setNewOrder({ ...newOrder, orderNumber: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customer" className="text-right">
                      Клиент
                    </Label>
                    <Input
                      id="customer"
                      value={newOrder.customer}
                      onChange={(e) => setNewOrder({ ...newOrder, customer: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Статус
                    </Label>
                    <Select
                      value={newOrder.status}
                      onValueChange={(value) => setNewOrder({ ...newOrder, status: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue>{newOrder.status}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Новый">Новый</SelectItem>
                        <SelectItem value="В обработке">В обработке</SelectItem>
                        <SelectItem value="Отправлен">Отправлен</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="items" className="text-right">
                      Кол-во товаров
                    </Label>
                    <Input
                      id="items"
                      type="number"
                      value={newOrder.items}
                      onChange={(e) => setNewOrder({ ...newOrder, items: Number.parseInt(e.target.value, 10) })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="total" className="text-right">
                      Сумма
                    </Label>
                    <Input
                      id="total"
                      type="number"
                      value={newOrder.total}
                      onChange={(e) => setNewOrder({ ...newOrder, total: Number.parseFloat(e.target.value) })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={handleAddOrder}>Добавить заказ</Button>
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? (
            <p>Загрузка...</p>
          ) : (
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
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{order.total} ₽</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                            Редактировать
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Редактировать заказ {selectedOrder?.orderNumber}</DialogTitle>
                            <DialogDescription>Измените информацию о заказе и нажмите Сохранить.</DialogDescription>
                          </DialogHeader>
                          {selectedOrder && (
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="customer" className="text-right">
                                  Клиент
                                </Label>
                                <Input
                                  id="customer"
                                  value={selectedOrder.customer}
                                  onChange={(e) => setSelectedOrder({ ...selectedOrder, customer: e.target.value })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">
                                  Статус
                                </Label>
                                <Select
                                  value={selectedOrder.status}
                                  onValueChange={(value) => setSelectedOrder({ ...selectedOrder, status: value })}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue>{selectedOrder.status}</SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Новый">Новый</SelectItem>
                                    <SelectItem value="В обработке">В обработке</SelectItem>
                                    <SelectItem value="Отправлен">Отправлен</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="items" className="text-right">
                                  Кол-во товаров
                                </Label>
                                <Input
                                  id="items"
                                  type="number"
                                  value={selectedOrder.items}
                                  onChange={(e) =>
                                    setSelectedOrder({ ...selectedOrder, items: Number.parseInt(e.target.value, 10) })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="total" className="text-right">
                                  Сумма
                                </Label>
                                <Input
                                  id="total"
                                  type="number"
                                  value={selectedOrder.total}
                                  onChange={(e) =>
                                    setSelectedOrder({ ...selectedOrder, total: Number.parseFloat(e.target.value) })
                                  }
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                          )}
                          <Button onClick={handleEditOrder}>Сохранить</Button>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="ml-2">
                            Завершить заказ
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Завершить заказ</DialogTitle>
                            <DialogDescription>
                              Вы уверены, что хотите завершить этот заказ? Это действие нельзя отменить.
                            </DialogDescription>
                          </DialogHeader>
                          <Button onClick={() => handleCompleteOrder(order.id)}>Подтвердить завершение</Button>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

