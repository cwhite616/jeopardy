import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.API_KEY_OPENAI,
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const difficulty = searchParams.get('difficulty') || 'high'

  const difficultyPrompts = {
    middle: "Create content suitable for middle school students (grades 6-8). Questions should cover basic history, science, geography, and popular culture that a typical middle school student would learn.",
    high: "Create content suitable for high school students. Questions should cover standard high school curriculum topics and general knowledge a high school graduate would know.",
    college: "Create content suitable for college students. Questions can be more complex and cover a broader range of academic subjects, current events, and cultural knowledge.",
    postgrad: "Create advanced content suitable for post-graduate level. Questions can be highly specific, technical, or cover obscure topics that would challenge well-educated adults."
  }

  try {
    if (!process.env.API_KEY_OPENAI) {
      console.error('OpenAI API key is not configured')
      return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are generating Final Jeopardy content in the style of the TV show. ${difficultyPrompts[difficulty as keyof typeof difficultyPrompts]} In Jeopardy, contestants are given an ANSWER that contains facts and details, and they must respond with a QUESTION.`
        },
        {
          role: "user",
          content: "Generate a Final Jeopardy category, answer, and question. The answer should be detailed and provide clues, while the question should be in the form of 'What is...', 'Who is...', or 'Where is...'. Return in JSON format with fields: category, answer, question"
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const content = response.choices[0].message.content
    console.log('OpenAI Response:', content) // Debug log

    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    try {
      const data = JSON.parse(content)
      if (!data.category || !data.answer || !data.question) {
        throw new Error('Invalid response format')
      }
      return NextResponse.json(data)
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Content:', content)
      return NextResponse.json({ error: 'Invalid response format from AI' }, { status: 500 })
    }
  } catch (error: unknown) {
    console.error('Final Jeopardy Error:', error instanceof Error ? error.message : error, error)
    return NextResponse.json({ 
      error: 'Failed to generate Final Jeopardy',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 