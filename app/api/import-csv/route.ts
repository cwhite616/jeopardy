import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { promises as fs } from 'fs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const content = buffer.toString()

    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
    })

    // Process the CSV data and format it for the Jeopardy board
    const categories = Array.from(new Set(records.map((record: any) => record.category)))
    const board = categories.map(category => ({
      name: category,
      questions: records
        .filter((record: any) => record.category === category)
        .map((record: any) => ({
          value: parseInt(record.value),
          answer: record.answer,
          question: record.question,
          revealed: false,
        })),
    }))

    return NextResponse.json({ board })
  } catch (error) {
    console.error('Error processing CSV:', error)
    return NextResponse.json({ error: 'Error processing CSV' }, { status: 500 })
  }
}

