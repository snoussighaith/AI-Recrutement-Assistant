'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Accueil', icon: '🏠' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/upload', label: 'Upload CV', icon: '📄' },
    { href: '/matching', label: 'Matching', icon: '🎯' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl">🤖</div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Recrutement
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm flex items-center gap-2 ${
                  pathname === link.href
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{link.icon}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Theme Toggle (Placeholder) */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900">
            🌙
          </button>
        </div>
      </div>
    </nav>
  )
}
