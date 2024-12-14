'use client'

import { motion } from 'framer-motion'
import { RotateCw } from 'lucide-react'

interface Question {
  value: number
  answer: string
  question: string
  revealed: boolean
  showQuestion?: boolean
  isDailyDouble?: boolean
  showDailyDouble?: boolean
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
}

export default function JeopardyCell({ item, onClick, onReset, isActive, activeCell }: JeopardyCellProps) {
  const handleResetClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onReset?.()
  }

  return (
    <motion.div
      className={`h-[calc((100vh-6rem)/6)] bg-blue-700 text-yellow-300 text-2xl md:text-3xl font-serif rounded cursor-pointer perspective-500 ${
        isActive ? 'ring-2 ring-yellow-300' : ''
      } ${!item.revealed && !isActive ? 'hover:scale-102' : ''}`}
      whileHover={!item.revealed && !isActive ? { scale: 1.02 } : {}}
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
            className="absolute w-full h-full flex items-center justify-center bg-blue-700 backface-hidden"
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
                          aria-label="Reset question"
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
  )
} 