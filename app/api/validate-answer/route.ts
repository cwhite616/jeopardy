import { OpenAI } from 'openai'
import { NextRequest, NextResponse } from 'next/server'

interface OpenAIError {
  status?: number
  message?: string
  error?: {
    message?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.API_KEY_OPENAI) {
      console.error('OpenAI API key is not configured')
      return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 })
    }

    const { playerAnswer, correctQuestion } = await req.json()
    console.log('Received request:', { playerAnswer, correctQuestion })

    const openai = new OpenAI({
      apiKey: process.env.API_KEY_OPENAI,
    })

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are judging answers in a Jeopardy game. You should determine if the player's response is close enough to the correct answer to be considered valid. Consider that in Jeopardy, answers must be phrased as questions, but be lenient with exact wording if the core concept is correct."
          },
          {
            role: "user",
            content: `The correct question is: "${correctQuestion}"\nThe player's response was: "${playerAnswer}"\nIs this answer correct? Reply with just 'CORRECT' or 'INCORRECT'.`
          }
        ],
      })
      const result = response.choices[0].message.content?.trim()
      return NextResponse.json({ isCorrect: result === 'CORRECT' })
    } catch (openaiError: unknown) {
      console.error('OpenAI API error:', openaiError)
      const error = openaiError as OpenAIError
      const isQuotaError = error.status === 429 || 
        error.message?.includes('quota') || 
        error.error?.message?.includes('quota')
      
      return NextResponse.json({ 
        error: isQuotaError ? 'QUOTA_ERROR' : 'OpenAI API error',
        details: error.message 
      }, { status: error.status || 500 })
    }
  } catch (error: unknown) {
    console.error('Request processing error:', error)
    return NextResponse.json({ 
      error: 'Failed to process request', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 