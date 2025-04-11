"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, User, Settings, HelpCircle, LogOut, Menu, X, Sun, Moon, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DashboardHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [fontSize, setFontSize] = useState("normal")
  const [theme, setTheme] = useState("light")
  const { toast } = useToast()

  // Initialize theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"
    setTheme(savedTheme)

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const increaseFontSize = () => {
    if (fontSize === "normal") {
      setFontSize("large")
      document.documentElement.classList.add("text-lg")
      document.documentElement.classList.remove("text-xl")
    } else if (fontSize === "large") {
      setFontSize("extra-large")
      document.documentElement.classList.remove("text-lg")
      document.documentElement.classList.add("text-xl")
    }

    toast({
      title: "Font Size Changed",
      description: `Text size has been increased for better readability.`,
    })
  }

  const decreaseFontSize = () => {
    if (fontSize === "extra-large") {
      setFontSize("large")
      document.documentElement.classList.remove("text-xl")
      document.documentElement.classList.add("text-lg")
    } else if (fontSize === "large") {
      setFontSize("normal")
      document.documentElement.classList.remove("text-lg")
      document.documentElement.classList.remove("text-xl")
    }

    toast({
      title: "Font Size Changed",
      description: `Text size has been decreased.`,
    })
  }

  const toggleColorMode = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Save theme preference to localStorage
    localStorage.setItem("theme", newTheme)

    toast({
      title: "Display Mode Changed",
      description: newTheme === "dark" ? "Dark mode activated for reduced eye strain." : "Light mode activated.",
    })
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Heart className="h-8 w-8 text-red-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Health Companion</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <User className="mr-2 h-5 w-5" />
                Profile
              </Button>
            </Link>
            <Link href="/help">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <HelpCircle className="mr-2 h-5 w-5" />
                Help
              </Button>
            </Link>

            {/* Accessibility Controls */}
            <div className="flex items-center space-x-2 ml-4 border-l pl-4 border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseFontSize}
                disabled={fontSize === "normal"}
                className="rounded-full h-8 w-8 dark:border-gray-600 dark:text-gray-300"
                aria-label="Decrease font size"
              >
                <span className="text-sm">A-</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={increaseFontSize}
                disabled={fontSize === "extra-large"}
                className="rounded-full h-8 w-8 dark:border-gray-600 dark:text-gray-300"
                aria-label="Increase font size"
              >
                <span className="text-sm">A+</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleColorMode}
                className="rounded-full h-8 w-8 dark:border-gray-600"
                aria-label="Toggle dark mode"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-300 font-medium">JD</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="text-gray-600 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <User className="mr-2 h-5 w-5" />
                Profile
              </Button>
            </Link>
            <Link href="/help">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <HelpCircle className="mr-2 h-5 w-5" />
                Help
              </Button>
            </Link>
            <Link href="/settings">
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>
            </Link>

            {/* Accessibility Controls */}
            <div className="flex items-center space-x-2 py-2 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={decreaseFontSize}
                disabled={fontSize === "normal"}
                className="rounded-full dark:border-gray-600 dark:text-gray-300"
                aria-label="Decrease font size"
              >
                <span className="text-sm">A-</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={increaseFontSize}
                disabled={fontSize === "extra-large"}
                className="rounded-full dark:border-gray-600 dark:text-gray-300"
                aria-label="Increase font size"
              >
                <span className="text-sm">A+</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleColorMode}
                className="rounded-full dark:border-gray-600"
                aria-label="Toggle dark mode"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Log out
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
