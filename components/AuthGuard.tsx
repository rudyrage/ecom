"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/auth.store"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, requireAuth = false, requireAdmin = false, fallback }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking auth state
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        const currentPath = window.location.pathname
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
        return
      }

      if (requireAdmin && (!isAuthenticated || user?.role !== "ADMIN")) {
        router.push("/")
        return
      }
    }
  }, [isLoading, requireAuth, requireAdmin, isAuthenticated, user, router])

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (requireAdmin && (!isAuthenticated || user?.role !== "ADMIN")) {
    return null
  }

  return <>{children}</>
}
