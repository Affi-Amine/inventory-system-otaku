import { Bell, Search } from "lucide-react"
import Image from "next/image"

export function TopNav() {
  return (
    <div className="h-16 px-6 border-b bg-white flex items-center justify-between">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>
        <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
          <Image src="/placeholder.svg" alt="Avatar" width={32} height={32} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  )
}

