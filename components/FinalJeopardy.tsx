'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface FinalJeopardyProps {
  onReturn: () => void
  difficulty: string
}

interface FinalJeopardyContent {
  category: string
  answer: string
  question: string
}

export default function FinalJeopardy({ onReturn, difficulty }: FinalJeopardyProps) {
  const [content, setContent] = useState<FinalJeopardyContent | null>(null)
  const [showQuestion, setShowQuestion] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [isInitialView, setIsInitialView] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/final-jeopardy?difficulty=${difficulty}`)
        const data = await response.json()
        if (isMounted) {
          setContent(data)
        }
      } catch (error) {
        console.error('Error fetching Final Jeopardy:', error)
      }
    }

    fetchContent()

    return () => {
      isMounted = false
    }
  }, [difficulty])

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setIsCountingDown(false)
      setShowQuestion(false)
    }
  }, [countdown, isCountingDown])

  const handleShowAnswer = () => {
    setIsCountingDown(true)
    setIsInitialView(false)
  }

  if (!content) return (
    <div className="min-h-screen bg-blue-800 flex items-center justify-center">
      <motion.div 
        className="w-16 h-16 border-4 border-yellow-300 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-blue-800 p-4 text-white">
      <button
        onClick={onReturn}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-700 rounded hover:bg-blue-600 transition-colors"
      >
        Return to Board
      </button>
      <AnimatePresence mode="wait">
        {isInitialView ? (
          <motion.div
            key="category"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col items-center justify-center"
          >
            <h1 className="text-5xl md:text-7xl text-center mb-8">
              {content.category}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Please write down your wagers
            </p>
            <button
              onClick={handleShowAnswer}
              className="px-6 py-3 bg-blue-700 rounded hover:bg-blue-600 transition-colors"
            >
              Show Answer
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="answer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col items-center justify-center"
          >
            <div className="text-5xl md:text-7xl text-center mb-8">
              {content.answer}
            </div>
            {isCountingDown ? (
              <div className="text-4xl font-bold">
                {countdown}
              </div>
            ) : showQuestion ? (
              <div className="text-5xl md:text-7xl text-center mt-12">
                {content.question}
              </div>
            ) : (
              <button
                onClick={() => setShowQuestion(true)}
                className="px-6 py-3 bg-blue-700 rounded hover:bg-blue-600 transition-colors mt-8"
              >
                Show Question
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 