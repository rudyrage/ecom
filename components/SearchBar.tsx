"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchStore } from "@/store/search.store"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  className?: string
  placeholder?: string
}

export default function SearchBar({ className = "", placeholder = "Search products..." }: SearchBarProps) {
  const { query, setQuery, search } = useSearchStore()
  const [localQuery, setLocalQuery] = useState(query)
  const router = useRouter()

  useEffect(() => {
    setLocalQuery(query)
  }, [query])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (localQuery.trim()) {
      setQuery(localQuery.trim())
      await search()
      router.push(`/search?q=${encodeURIComponent(localQuery.trim())}`)
    }
  }

  const handleClear = () => {
    setLocalQuery("")
    setQuery("")
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {localQuery && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
}
