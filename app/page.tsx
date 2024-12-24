'use client'

import { useState } from 'react'
import JeopardyBoard from '@/components/JeopardyBoard'
import FinalJeopardy from '@/components/FinalJeopardy'

export default function Home() {
  const [showFinalJeopardy, setShowFinalJeopardy] = useState(false)
  const [difficulty, setDifficulty] = useState<string>('high')

  return (
    <main className="min-h-screen bg-blue-800 p-4 md:p-8">
      <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]">
        {showFinalJeopardy ? (
          <FinalJeopardy 
            onReturn={() => setShowFinalJeopardy(false)} 
            difficulty={difficulty}
          />
        ) : (
          <JeopardyBoard 
            onFinalJeopardy={(diff) => {
              setDifficulty(diff)
              setShowFinalJeopardy(true)
            }} 
          />
        )}
      </div>
    </main>
  )
}

