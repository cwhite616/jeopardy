'use client'

import { motion } from 'framer-motion'
import { RotateCw } from 'lucide-react'

interface QuestionModalProps {
  question: string
  onClose: (e: React.MouseEvent) => void
  onReset: (e: React.MouseEvent) => void
}

export default function QuestionModal({ question, onClose, onReset }: QuestionModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-blue-700 p-8 rounded-lg shadow-lg max-w-2xl w-full mx-4 text-center"
      >
        <button
          onClick={onReset}
          aria-label="Reset to answer"
          className="absolute top-4 right-4 p-1 hover:bg-blue-800 rounded-full transition-colors"
        >
          <RotateCw className="w-5 h-5 text-yellow-300" />
        </button>
        <div className="text-yellow-300 text-2xl md:text-3xl font-serif mb-8">
          {question}
        </div>
        <button
          onClick={onClose}
          className="bg-blue-800 text-yellow-300 px-6 py-2 rounded-full hover:bg-blue-900 transition-colors"
        >
          Continue
        </button>
      </motion.div>
    </motion.div>
  )
} 