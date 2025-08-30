"use client";

import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import CartIcon from "./CartIcon";
import CartDrawer from "./CartDrawer";
import UserDropdown from "./UserDropdown";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import Link from "next/link";

export default function Header() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <header className="bg-white text-gray-600 shadow-md sticky top-0 z-40 border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <MobileMenu />
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 hover:text-blue-700"
            >
              MyShop
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar className="w-full" />
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <CartIcon />
                <UserDropdown />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-4">
          <SearchBar className="w-full" />
        </div>
      </header>

      <CartDrawer />
    </>
  );
}
