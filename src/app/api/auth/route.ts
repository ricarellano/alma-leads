import { NextResponse } from 'next/server'

const MOCK_USER = {
  username: 'admin',
  password: 'password123'
}

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (username === MOCK_USER.username && password === MOCK_USER.password) {
    return NextResponse.json({ token: 'mock_token' }, { status: 200 })
  } else {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}
