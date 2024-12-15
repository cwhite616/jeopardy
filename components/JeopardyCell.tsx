'use client'

import { motion } from 'framer-motion'
import { RotateCw, X } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

interface Question {
  value: number
  answer: string
  question: string
  revealed: boolean
  showQuestion?: boolean
  isDailyDouble?: boolean
  showDailyDouble?: boolean
  showModal?: boolean
  wasRevealed?: boolean
}

interface ActiveCell {
  categoryIndex: number
  questionIndex: number
}

interface JeopardyCellProps {
  item: Question
  onClick: () => void
  onReset?: () => void
  isActive?: boolean
  activeCell: ActiveCell | null
  isTestMode?: boolean
}

export default function JeopardyCell({ item, onClick, onReset, isActive, activeCell, isTestMode }: JeopardyCellProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCorrect, setShowCorrect] = useState(false)
  const [isIncorrect, setIsIncorrect] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [incorrectAttempts, setIncorrectAttempts] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showDailyDoubleAnimation, setShowDailyDoubleAnimation] = useState(true)

  useEffect(() => {
    if (item.showDailyDouble) {
      setShowDailyDoubleAnimation(true)
      const timer = setTimeout(() => {
        setShowDailyDoubleAnimation(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [item.showDailyDouble])

  const handleResetClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onReset?.()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputRef.current?.value) return

    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/validate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerAnswer: inputRef.current.value,
          correctQuestion: item.question
        })
      })

      const data = await response.json()
      
      if (data.error === 'QUOTA_ERROR') {
        setError('OpenAI API quota exceeded. Please try again later.')
        return
      }
      
      if (data.isCorrect) {
        setShowCorrect(true)
        setIsIncorrect(false)
        setTimeout(() => {
          setShowCorrect(false)
          onClick()
        }, 2000)
      } else {
        setIsIncorrect(true)
        setIncorrectAttempts(prev => prev + 1)
        inputRef.current.value = ''
        inputRef.current.focus()
      }
    } catch (error) {
      console.error('Error validating answer:', error)
      setError('Failed to validate answer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Dimming overlay */}
      <AnimatePresence>
        {item.revealed && !item.showQuestion && (
          <motion.div
            className="fixed inset-0 bg-black/50 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Regular cell */}
      <motion.div
        className={`h-[calc((100vh-6rem)/6)] bg-blue-700 text-yellow-300 text-2xl md:text-3xl font-serif rounded cursor-pointer perspective-500 ${
          isActive ? 'ring-2 ring-yellow-300' : ''
        } ${!item.revealed && !isActive ? 'hover:scale-102' : ''}`}
        whileHover={!item.revealed && !isActive ? { scale: 1.02 } : {}}
        style={{
          visibility: item.revealed && !item.showQuestion ? 'hidden' : 'visible'
        }}
        onClick={onClick}
      >
        <div className="relative w-full h-full">
          <motion.div
            className="absolute inset-0 preserve-3d"
            initial={false}
            animate={{
              rotateX: item.revealed ? 180 : 0,
            }}
            transition={{ duration: 0.6 }}
          >
            {/* Front face */}
            <div 
              className={`absolute w-full h-full flex items-center justify-center bg-blue-700 backface-hidden ${
                item.wasRevealed ? 'italic' : ''
              } ${isTestMode && item.isDailyDouble ? 'ring-2 ring-cyan-400' : ''}`}
            >
              ${item.value}
            </div>
            {/* Back face */}
            <div 
              className={`absolute w-full h-full flex items-center justify-center backface-hidden rotate-x-180 ${
                item.showQuestion ? 'bg-blue-600/70' : 'bg-blue-700'
              }`}
            >
              <div className="text-center text-lg p-2">
                {item.revealed && (
                  <>
                    {item.showDailyDouble ? (
                      <span className="text-3xl font-bold">DAILY DOUBLE!</span>
                    ) : (
                      <>
                        {item.showQuestion && (!activeCell || isActive) && (
                          <button
                            onClick={handleResetClick}
                            aria-label="Reset value"
                            className="absolute top-2 right-2 p-1 hover:bg-blue-800 rounded-full transition-colors reset-button"
                          >
                            <RotateCw className="w-5 h-5" />
                          </button>
                        )}
                        {item.showQuestion ? item.question : item.answer}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Centered answer overlay */}
      <AnimatePresence>
        {item.revealed && !item.showQuestion && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-[80vw] h-[60vh] bg-blue-700 text-yellow-300 text-2xl md:text-3xl font-serif rounded relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              {item.isDailyDouble && (
                <div className="absolute top-4 left-0 w-full text-center font-bold">
                  DAILY DOUBLE!
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={onClick}
                  aria-label="Reveal Question"
                  title="Reveal Question"
                  className="p-1 hover:bg-blue-800 rounded-full transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={handleResetClick}
                  aria-label="Reset Question to Points"
                  title="Reset Question to Points"
                  className="p-1 hover:bg-blue-800 rounded-full transition-colors z-10"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div className="text-center text-3xl md:text-4xl p-8 flex-grow flex items-center justify-center">
                  {showCorrect ? (
                    <div className="text-green-400 font-bold">Correct!</div>
                  ) : item.isDailyDouble && showDailyDoubleAnimation ? (
                    <motion.div
                      className="text-4xl md:text-5xl font-bold"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1]
                      }}
                      transition={{
                        duration: 1,
                        repeat: 1
                      }}
                    >
                      DAILY DOUBLE!
                    </motion.div>
                  ) : (
                    item.answer
                  )}
                </div>
                {(!item.isDailyDouble || !showDailyDoubleAnimation) && (
                  <div className="w-full p-8">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        className="flex-grow px-4 py-2 rounded bg-white text-blue-900 text-xl placeholder:text-blue-900/50"
                        placeholder="Enter your question..."
                        disabled={isSubmitting || showCorrect}
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || showCorrect}
                        className="px-6 py-2 bg-blue-800 rounded hover:bg-blue-900 transition-colors disabled:opacity-50"
                      >
                        Submit
                      </button>
                    </form>
                    {error ? (
                      <div className="text-red-400 text-xl mt-2">
                        {error}
                      </div>
                    ) : isIncorrect && (
                      <motion.div
                        key={incorrectAttempts}
                        initial={{ color: '#FF0000', opacity: 1 }}
                        animate={{ color: '#EF4444', opacity: 0 }}
                        transition={{ 
                          color: { duration: 3 },
                          opacity: { duration: 8 }
                        }}
                        className="text-xl mt-2"
                      >
                        Incorrect. Try again!
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 