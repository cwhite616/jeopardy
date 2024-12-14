'use client'

import { useState, useRef } from 'react'
import { MenuItems } from './MenuItems'
import { createMenuItems } from './menu-config'

interface HamburgerMenuProps {
  onReset: () => void
  onImportCSV: (file: File) => void
}

export default function HamburgerMenu({ onReset, onImportCSV }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImportCSV(file)
    }
  }

  const menuItems = createMenuItems({
    onImportClick: handleImportClick,
    onReset,
  })

  return (
    <div className="absolute top-4 right-4">
      <button
        className="text-yellow-300 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      
      {isOpen && <MenuItems items={menuItems} onClose={() => setIsOpen(false)} />}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
        aria-label="Import CSV file"
      />
    </div>
  )
}

