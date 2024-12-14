'use client'

import { useState } from 'react'
import HamburgerMenu from './HamburgerMenu'
import JeopardyCell from './JeopardyCell'

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
}

interface Category {
  name: string
  questions: Question[]
}

export default function JeopardyBoard() {
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
        if (cell.isDailyDouble) {
          cell.showDailyDouble = true
          cell.showQuestion = false
        } else {
          cell.showQuestion = false
        }
      } else if (cell.isDailyDouble && cell.showDailyDouble) {
        cell.showDailyDouble = false
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
      <HamburgerMenu onReset={resetBoard} onImportCSV={importCSV} />
      <div className="grid grid-cols-5 gap-1 md:gap-2 h-[calc(100vh-2rem)]">
        {board.map((category, categoryIndex) => (
          <div key={category.name} className="space-y-1 md:space-y-2">
            <div className="h-[calc((100vh-6rem)/6)] flex items-center justify-center bg-blue-900 text-yellow-300 text-xl md:text-2xl font-serif p-2 rounded">
              {category.name}
            </div>
            {category.questions.map((item, questionIndex) => (
              <JeopardyCell
                key={item.value}
                item={item}
                onClick={() => revealCell(categoryIndex, questionIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

