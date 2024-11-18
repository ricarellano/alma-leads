import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const { status } = await request.json()

  console.log('params', id)
  
  return NextResponse.json({ id, status }, { status: 200 })
}