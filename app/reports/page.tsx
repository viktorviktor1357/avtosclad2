import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Янв", sales: 4000, purchases: 2400 },
  { name: "Фев", sales: 3000, purchases: 1398 },
  { name: "Мар", sales: 2000, purchases: 9800 },
  { name: "Апр", sales: 2780, purchases: 3908 },
  { name: "Май", sales: 1890, purchases: 4800 },
  { name: "Июн", sales: 2390, purchases: 3800 },
]

export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Отчеты</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Отчет по продажам и закупкам</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#8884d8" name="Продажи" />
                <Bar dataKey="purchases" fill="#82ca9d" name="Закупки" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Отчет по инвентарю</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="brakes">Тормозная система</SelectItem>
                <SelectItem value="filters">Фильтры</SelectItem>
                <SelectItem value="engine">Двигатель</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full">Сгенерировать отчет</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Отчет по поставщикам</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Выберите поставщика" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все поставщики</SelectItem>
                <SelectItem value="brembo">Brembo</SelectItem>
                <SelectItem value="mann-filter">Mann-Filter</SelectItem>
                <SelectItem value="ngk">NGK</SelectItem>
                <SelectItem value="bosch">Bosch</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full">Сгенерировать отчет</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Отчет по заказам</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Выберите период" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">За неделю</SelectItem>
                <SelectItem value="month">За месяц</SelectItem>
                <SelectItem value="quarter">За квартал</SelectItem>
                <SelectItem value="year">За год</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full">Сгенерировать отчет</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

