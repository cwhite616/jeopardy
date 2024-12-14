'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import HamburgerMenu from './HamburgerMenu'

const initialCategories = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']
const initialValues = [100, 200, 300, 400, 500]

export default function JeopardyBoard() {
  const [board, setBoard] = useState(
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
  }

  const revealCell = (categoryIndex: number, questionIndex: number) => {
    setBoard(prevBoard => {
      const newBoard = JSON.parse(JSON.stringify(prevBoard))
      const cell = newBoard[categoryIndex].questions[questionIndex]
      if (!cell.revealed) {
        cell.revealed = true
        cell.showQuestion = false
      } else if (!cell.showQuestion) {
        cell.showQuestion = true
      }
      return newBoard
    })
  }

  const importCSV = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/import-csv', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to import CSV')
      }

      const { board: newBoard } = await response.json()
      setBoard(newBoard)
    } catch (error) {
      console.error('Error importing CSV:', error)
      // Handle error (e.g., show an error message to the user)
    }
  }

  return (
    <div className="relative w-full max-w-6xl p-4">
      <HamburgerMenu onReset={resetBoard} onImportCSV={importCSV} />
      <div className="grid grid-cols-5 gap-4">
        {board.map((category, categoryIndex) => (
          <div key={category.name} className="space-y-4">
            <div className="h-24 flex items-center justify-center bg-blue-900 text-yellow-300 text-2xl font-serif p-2 rounded">
              {category.name}
            </div>
            {category.questions.map((item, questionIndex) => (
              <motion.div
                key={item.value}
                className="h-24 bg-blue-700 text-yellow-300 text-3xl font-serif rounded cursor-pointer perspective-500"
                whileHover={{ scale: 1.05 }}
                onClick={() => revealCell(categoryIndex, questionIndex)}
              >
                <div className="relative w-full h-full">
                  <motion.div
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                      rotateX: item.revealed ? 180 : 0,
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Front face */}
                    <div 
                      className="absolute w-full h-full flex items-center justify-center bg-blue-700"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      ${item.value}
                    </div>
                    {/* Back face */}
                    <div 
                      className={`absolute w-full h-full flex items-center justify-center ${
                        item.showQuestion ? 'bg-blue-600/70' : 'bg-blue-700'
                      }`}
                      style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateX(180deg)'
                      }}
                    >
                      <div className="text-center text-lg p-2">
                        {item.revealed && (item.showQuestion ? item.question : item.answer)}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

