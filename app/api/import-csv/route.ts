import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'

// Define an interface for the CSV record
interface CSVRecord {
  category: string
  value: string
  question: string
  answer: string
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const content = buffer.toString()

    // Parse the CSV first to get headers
    const parsedRecords = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    })

    if (parsedRecords.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 })
    }

    // Find the required column names by matching normalized versions
    const categoryColumn = Object.keys(parsedRecords[0]).find(
      key => key.toLowerCase().trim().replace(/[^a-z]/g, '') === 'category'
    )
    const valueColumn = Object.keys(parsedRecords[0]).find(
      key => key.toLowerCase().trim().replace(/[^a-z]/g, '').includes('value')
    )
    const questionColumn = Object.keys(parsedRecords[0]).find(
      key => key.toLowerCase().trim().replace(/[^a-z]/g, '') === 'question'
    )
    const answerColumn = Object.keys(parsedRecords[0]).find(
      key => key.toLowerCase().trim().replace(/[^a-z]/g, '') === 'answer'
    )

    if (!categoryColumn || !valueColumn || !questionColumn || !answerColumn) {
      return NextResponse.json(
        {
          error: 'Missing required columns',
          required: ['Category', 'Point Value', 'Question', 'Answer'],
          found: Object.keys(parsedRecords[0]),
        },
        { status: 400 }
      )
    }

    // Map the records to our expected format
    const records: CSVRecord[] = parsedRecords.map((record: Record<string, string>) => ({
      category: record[categoryColumn],
      value: record[valueColumn].replace(/[^0-9]/g, ''),
      question: record[questionColumn],
      answer: record[answerColumn],
    }))

    // Validate that we have valid point values
    const invalidRecords = records.filter(record => !record.value || isNaN(parseInt(record.value)))
    if (invalidRecords.length > 0) {
      return NextResponse.json({
        error: 'Invalid point values found',
        invalidRecords,
      }, { status: 400 })
    }

    // Process the CSV data and format it for the Jeopardy board
    const categories = Array.from(new Set(records.map(record => record.category)))
    const board = categories.map(category => ({
      name: category,
      questions: records
        .filter(record => record.category === category)
        .map(record => ({
          value: parseInt(record.value),
          answer: record.answer,
          question: record.question,
          revealed: false,
        })),
    }))

    // Randomly select one question to be the daily double
    const randomCategoryIndex = Math.floor(Math.random() * board.length)
    const randomQuestionIndex = Math.floor(Math.random() * board[randomCategoryIndex].questions.length)
    board[randomCategoryIndex].questions[randomQuestionIndex].isDailyDouble = true

    return NextResponse.json({ board })
  } catch (error) {
    console.error('Error processing CSV:', error)
    return NextResponse.json({ 
      error: 'Error processing CSV',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

