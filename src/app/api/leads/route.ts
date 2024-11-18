import { NextResponse } from 'next/server'

// Mock database
let leads: Lead[] = [
  {
    id: '1',
    firstName: 'Jorge',
    lastName: 'Ruiz',
    email: 'jorge@example.com',
    linkedin: 'https://linkedin.com/in/jorgeruiz',
    visaInterest: 'O-1',
    resume: '/uploads/jorge_ruiz.pdf',
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
    resume: '/uploads/john_doe.pdf',
    additionalInfo: 'Visa',
    submitted: '02/02/2024, 2:45 PM',
    status: 'PENDING',
    country: 'Canada'
  },
]

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  linkedin: string
  visaInterest: string
  resume: string
  additionalInfo: string
  status: 'PENDING' | 'REACHED_OUT'
  submitted: string
  country: string
}

export async function GET() {
  return NextResponse.json(leads)
}

export async function POST(request: Request) {
  const formData = await request.formData()
  
  const newLead: Lead = {
    id: (leads.length + 1).toString(),
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    linkedin: formData.get('linkedin') as string,
    visaInterest: formData.get('visaInterest') as string,
    resume: (formData.get('resume') as File).name, // Store file name
    additionalInfo: formData.get('additionalInfo') as string,
    status: 'PENDING',
    submitted: new Date().toISOString(),
    country: formData.get('country') as string,
  }
  
  leads.push(newLead)
  return NextResponse.json(newLead, { status: 201 })
}

export async function PATCH(request: Request) {
  const { id, status } = await request.json()
  const leadIndex = leads.findIndex(lead => lead.id === id)
  
  if (leadIndex === -1) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  leads[leadIndex].status = status
  return NextResponse.json(leads[leadIndex])
}
