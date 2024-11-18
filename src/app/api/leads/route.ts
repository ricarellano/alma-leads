import { NextResponse } from 'next/server'

type Lead = {
  id: string
  firstName: string
  lastName: string
  email: string
  linkedin: string
  visaInterest: string
  resumeUrl: string
  additionalInfo: string
  submitted: string
  status: 'PENDING' | 'REACHED_OUT'
  country: string
}

let leads: Lead[] = [
  {
    id: '1',
    firstName: 'Jorge',
    lastName: 'Ruiz',
    email: 'jorge@example.com',
    linkedin: 'https://linkedin.com/in/jorgeruiz',
    visaInterest: 'O-1',
    resumeUrl: '/uploads/jorge_ruiz.pdf',
    additionalInfo: 'Visa',
    submitted: '02/02/2024, 2:45 PM',
    status: 'PENDING',
    country: 'Mexico'
  },
  {
    id: '2',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    linkedin: 'https://linkedin.com/in/johndoe',
    visaInterest: 'O-1',
    resumeUrl: '/uploads/john_doe.pdf',
    additionalInfo: 'Visa',
    submitted: '02/02/2024, 2:45 PM',
    status: 'PENDING',
    country: 'Canada'
  },

]

export async function GET() {
  return NextResponse.json(leads)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newLead: Lead = {
    ...body,
    id: (leads.length + 1).toString(),
    submitted: new Date().toLocaleString(),
    status: 'PENDING'
  }
  leads.push(newLead)
  return NextResponse.json(newLead, { status: 201 })
}
