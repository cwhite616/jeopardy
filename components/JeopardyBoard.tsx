'use client'

import { useState } from 'react'
import HamburgerMenu from './HamburgerMenu'
import JeopardyCell from './JeopardyCell'
import { motion } from 'framer-motion'

const initialCategories = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']
const initialValues = [100, 200, 300, 400, 500]

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

interface Category {
  name: string
  questions: Question[]
}

interface ActiveCell {
  categoryIndex: number
  questionIndex: number
}

interface JeopardyBoardProps {
  onFinalJeopardy: (difficulty: string) => void
}

export default function JeopardyBoard({ onFinalJeopardy }: JeopardyBoardProps) {
  const isTestMode = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).get('test') === 'true'

  const [board, setBoard] = useState<Category[]>(
    initialCategories.map(category => ({
      name: category,
      questions: initialValues.map(value => ({
        value,
        answer: `Answer for $${value}`,
        question: `Question for $${value}`,
        revealed: false,
        showQuestion: false,
      })),
    }))
  )
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null)

  const resetBoard = () => {
    setBoard(
      initialCategories.map(category => ({
        name: category,
        questions: initialValues.map(value => ({
          value,
          answer: `Answer for $${value}`,
          question: `Question for $${value}`,
          revealed: false,
          showQuestion: false,
        })),
      }))
    )
    setActiveCell(null)
  }

  const revealCell = (categoryIndex: number, questionIndex: number) => {
    if (activeCell && (activeCell.categoryIndex !== categoryIndex || activeCell.questionIndex !== questionIndex)) {
      return
    }

    setBoard(prevBoard => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard))
      const cell = newBoard[categoryIndex].questions[questionIndex]
      
      if (!cell.revealed) {
        cell.revealed = true
        if (cell.isDailyDouble) {
          cell.showDailyDouble = true
          cell.showQuestion = false
        } else {
          cell.showQuestion = false
        }
        setActiveCell({ categoryIndex, questionIndex })
      } else if (cell.isDailyDouble && cell.showDailyDouble) {
        cell.showDailyDouble = false
        cell.showQuestion = false
      } else if (!cell.showQuestion) {
        cell.showQuestion = true
        cell.showModal = true
        setActiveCell(null)
      } else {
        cell.showModal = false
        setActiveCell(null)
      }
      return newBoard
    })
  }

  const resetQuestion = (categoryIndex: number, questionIndex: number) => {
    setBoard(prevBoard => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard))
      const cell = newBoard[categoryIndex].questions[questionIndex]
      cell.revealed = false
      cell.showQuestion = false
      cell.showModal = false
      cell.showDailyDouble = false
      cell.wasRevealed = true
      return newBoard
    })
    setActiveCell(null)
  }

  const importCSV = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/import-csv', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import CSV')
      }

      const processedBoard = data.board.map((category: Category) => ({
        ...category,
        questions: category.questions.map((question: Question) => ({
          ...question,
          showQuestion: false,
        })),
      }))

      setBoard(processedBoard)
    } catch (error) {
      console.error('Error importing CSV:', error)
      // You might want to add some UI feedback here
      alert(error instanceof Error ? error.message : 'Failed to import CSV')
    }
  }

  return (
    <div className="relative w-full h-full p-2 md:p-4">
      {activeCell && !board[activeCell.categoryIndex].questions[activeCell.questionIndex].showQuestion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 pointer-events-none z-30"
        />
      )}
      <div className="relative z-[60]">
        <HamburgerMenu 
          onReset={resetBoard} 
          onImportCSV={importCSV}
          onShowFinalJeopardy={onFinalJeopardy}
          onShowBoard={() => {}}
        />
      </div>
      <div className="grid grid-cols-5 gap-1 md:gap-2 h-[calc(100vh-2rem)] relative z-40">
        {board.map((category, categoryIndex) => (
          <div key={category.name} className="space-y-1 md:space-y-2">
            <div className="h-[calc((100vh-6rem)/6)] flex items-center justify-center bg-blue-900 text-white text-3xl md:text-4xl lg:text-5xl p-4 rounded text-center">
              {category.name}
            </div>
            {category.questions.map((item, questionIndex) => (
              <JeopardyCell
                key={item.value}
                item={item}
                onClick={() => revealCell(categoryIndex, questionIndex)}
                onReset={() => resetQuestion(categoryIndex, questionIndex)}
                isActive={
                  activeCell?.categoryIndex === categoryIndex && 
                  activeCell?.questionIndex === questionIndex
                }
                activeCell={activeCell}
                isTestMode={isTestMode}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

