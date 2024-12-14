'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface HamburgerMenuProps {
  onReset: () => void
  onImportCSV: (file: File) => void
}

export default function HamburgerMenu({ onReset, onImportCSV }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      onImportCSV(file)
      setIsOpen(false)
    }
  }

  return (
    <div className="absolute top-4 right-4">
      <button
        className="text-yellow-300 focus:outline-none"
        onClick={toggleMenu}
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
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-48 bg-blue-900 rounded-md shadow-lg py-1 z-10"
        >
          <button
            onClick={handleImportClick}
            className="block px-4 py-2 text-sm text-yellow-300 hover:bg-blue-800 w-full text-left"
          >
            Import CSV
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
            aria-label="Import CSV file"
          />
          <button
            onClick={() => {
              onReset()
              setIsOpen(false)
            }}
            className="block px-4 py-2 text-sm text-yellow-300 hover:bg-blue-800 w-full text-left"
          >
            Reset Board
          </button>
        </motion.div>
      )}
    </div>
  )
}

