import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-blue-600 text-white">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-blue-200">
              Обзор
            </Link>
          </li>
          <li>
            <Link href="/inventory" className="hover:text-blue-200">
              Инвентарь
            </Link>
          </li>
          <li>
            <Link href="/orders" className="hover:text-blue-200">
              Заказы
            </Link>
          </li>
          <li>
            <Link href="/suppliers" className="hover:text-blue-200">
              Поставщики
            </Link>
          </li>
          <li>
            <Link href="/reports" className="hover:text-blue-200">
              Отчеты
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

