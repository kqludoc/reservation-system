"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 animate-fade-in-up">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center shadow-md">
            <span className="text-sm font-bold text-white">SV</span>
          </div>
          <span className="hidden font-bold text-foreground sm:inline text-lg">SportVenue</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#activities" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Activities
          </Link>
          <Link href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:flex bg-transparent">
            <Link href="/admin/login">Admin Login</Link>
          </Button>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-border bg-background p-4 md:hidden">
            <nav className="flex flex-col gap-4">
              <Link href="#activities" className="text-sm font-medium text-foreground hover:text-primary">
                Activities
              </Link>
              <Link href="#contact" className="text-sm font-medium text-foreground hover:text-primary">
                Contact
              </Link>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin-login">Admin Login</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
