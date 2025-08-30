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
import {
  Eye,
  EyeOff,
  Loader2,
  ShoppingBag,
  Gift,
  Star,
  Users,
} from "lucide-react";

export default function RegisterClient() {
  const { login, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectPath = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectPath);
    }
  }, [isAuthenticated, router, redirectPath]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Save auth in store
      login(data.user, data.token);

      // Set cookie for server-side auth
      document.cookie = `auth-token=${data.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; samesite=strict`;

      // Redirect after registration
      router.push(redirectPath);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 p-12 flex-col justify-center text-white">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="h-10 w-10" />
            <h1 className="text-3xl font-bold">ShopEase</h1>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Join thousands of happy customers
          </h2>

          <p className="text-green-100 text-lg mb-8">
            Create your account today and unlock exclusive deals, faster
            checkout, and personalized recommendations.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Gift className="h-6 w-6 text-green-200" />
              <span className="text-green-100">
                Welcome bonus & exclusive offers
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-green-200" />
              <span className="text-green-100">
                Personalized recommendations
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-green-200" />
              <span className="text-green-100">
                Join 50,000+ satisfied customers
              </span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-500/20 rounded-lg border border-green-400/30">
            <p className="text-sm text-green-100">
              🎉 <strong>Limited Time:</strong> Get 20% off your first order
              when you sign up today!
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center pb-8">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <ShoppingBag className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">ShopEase</span>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Join us and start shopping today
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

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
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                  placeholder="Create a password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  minLength={6}
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
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
