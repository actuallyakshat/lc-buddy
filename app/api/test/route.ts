import { NextRequest, NextResponse } from 'next/server'

type ResponseData = {
  message: string
}

export const GET = (req: NextRequest) => {
  const responseData: ResponseData = { message: 'Hello from Next.js!' }
  return NextResponse.json(responseData)
}
