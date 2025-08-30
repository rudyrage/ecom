"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, ShoppingBag, Shield, Truck } from "lucide-react";

export default function LoginClient() {
  const { login, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectPath = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, redirectPath]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Save auth in store
      login(data.user, data.token);

      // Set cookie for server-side auth
      document.cookie = `auth-token=${data.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; samesite=strict`;

      // Redirect after login
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-center text-white">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="h-10 w-10" />
            <h1 className="text-3xl font-bold">ShopEase</h1>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Welcome back to your favorite shopping destination
          </h2>

          <p className="text-blue-100 text-lg mb-8">
            Continue your shopping journey with thousands of products at
            unbeatable prices.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-blue-200" />
              <span className="text-blue-100">Secure & Safe Shopping</span>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-6 w-6 text-blue-200" />
              <span className="text-blue-100">Fast & Free Delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-6 w-6 text-blue-200" />
              <span className="text-blue-100">Exclusive Member Deals</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ShopEase</span>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Sign in to your account to continue shopping
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin} className="px-8 pb-8">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
