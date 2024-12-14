import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.API_KEY_OPENAI
  
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  // Use the API key here
  // ...

  return NextResponse.json({ message: 'Success' })
} 