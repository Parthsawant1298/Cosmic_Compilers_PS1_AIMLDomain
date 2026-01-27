"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Phone, Shield } from "lucide-react"

// Custom Button component
function Button({ children, className, ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b border-gray-200"
    >
      {/* Top contact bar */}
      <div className="bg-gray-900 text-white py-2 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm gap-2 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              <span>Emergency Services Integration Protocol Active</span>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <span className="text-green-400 font-semibold">SafeCity v2.0 Live</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                SafeCity
              </h1>
              <p className="text-xs text-green-600 font-medium tracking-wider">
                PREDICTIVE POLICING
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#features"
              className="text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
              Platform
            </Link>
            <Link
              href="/#impact"
              className="text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
              Impact
            </Link>
            <Link
              href="/#pricing"
              className="text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link href="/demo">
              <Button
                className="bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:shadow-green-200 transition-all duration-300"
              >
                Request Pilot
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-600 hover:text-green-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 pt-4 border-t border-gray-100 animate-fadeIn">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/#features"
                className="text-gray-600 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Platform
              </Link>
              <Link
                href="/#impact"
                className="text-gray-600 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Impact
              </Link>
              <Link
                href="/#pricing"
                className="text-gray-600 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link href="/demo" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                  Request Pilot
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  )
}