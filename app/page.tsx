import JeopardyBoard from '@/components/JeopardyBoard'

export default function Home() {
  return (
    <main className="min-h-screen bg-blue-800 p-4 md:p-8">
      <div className="h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]">
        <JeopardyBoard />
      </div>
    </main>
  )
}

