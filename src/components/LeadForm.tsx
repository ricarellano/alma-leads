'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useDispatch } from 'react-redux'
import { FileText, Heart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addLead } from '@/lib/features/leadsSlice'
import { AppDispatch } from '@/lib/store'

const formSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  country: z.string().min(1, 'Country is required'),
  linkedin: z.string().url('Invalid LinkedIn URL'),
  visaInterest: z.string().min(1, 'Please select a visa type'),
  resume: z.instanceof(File).refine((file) => file.size <= 5000000, 'File size should be less than 5MB'),
  additionalInfo: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function LeadForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const countries = [
    "Mexico",
    "United States",
    "Canada",
    "China",
    "India",
    "Brazil",
  ];

  const visaCategories = [
    "O-1",
    "EB-1A",
    "EB-2 NIW",
    "I don't know"
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      linkedin: '',
      visaInterest: '',
      additionalInfo: '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await dispatch(addLead(data)).unwrap()
      setIsSubmitted(true)
    } catch (error) {
      console.error('Failed to submit form:', error)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white">
        <CardContent className="flex flex-col items-center justify-center py-8 sm:py-16 px-4 sm:px-8">
          <FileText className="h-12 w-12 text-[#818CF8]" />
          <h2 className="text-xl sm:text-2xl font-bold mt-6 mb-2">Thank You</h2>
          <p className="text-gray-600 text-center text-sm max-w-md mb-8">
            Your information was submitted to our team of immigration attorneys. Expect an email from hello@tryalma.ai
          </p>
          <Button 
            onClick={() => {
              setIsSubmitted(false);
              form.reset();
            }} 
            className="bg-black text-white hover:bg-gray-900 rounded-md px-6 sm:px-8"
          >
            Go Back to Home Page
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white">
      <div className="bg-[#D4E7A5] p-6 sm:p-8 rounded-t-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/circles.svg')] bg-no-repeat bg-left-bottom" />
        <div className="relative z-10">
          <div className="text-sm font-medium mb-2">almă</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black">
            Get An Assessment<br />Of Your Immigration Case
          </h1>
        </div>
      </div>
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col items-center gap-4 mb-8">
          <FileText className="h-8 w-8 text-[#818CF8]" />
          <p className="text-center text-sm text-gray-600 max-w-md">
            Want to understand your visa options? Submit the form below and our team of experienced attorneys will review your information and send a preliminary assessment of your case based on your goals.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="First Name" {...field} className="bg-white border-gray-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} className="bg-white border-gray-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} className="bg-white border-gray-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Country of Citizenship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country, i) => (
                        <SelectItem key={i} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="LinkedIn / Personal Website URL" {...field} className="bg-white border-gray-200" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center gap-4">
              <div className="p-2 rounded-lg bg-[#818CF8] bg-opacity-10">
                <FileText className="h-6 w-6 text-[#818CF8]" />
              </div>
              <h3 className="text-base font-medium">Visa categories of interest?</h3>
            </div>
            <FormField
              control={form.control}
              name="visaInterest"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col items-start space-y-3"
                    >
                      {visaCategories.map((visa, i) => (
                        <FormItem  key={i} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={visa} />
                          </FormControl>
                          <div className="font-normal">{visa}</div>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resume"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) onChange(file)
                      }}
                      {...field}
                      className="bg-white border-gray-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center gap-4">
              <div className="p-2 rounded-lg bg-[#818CF8] bg-opacity-10">
                <Heart className="h-6 w-6 text-[#818CF8]" />
              </div>
              <h3 className="text-base font-medium">How can we help you?</h3>
            </div>
            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your background, what is your past immigration history? Are you looking to get a new visa? Want to apply for a green card?"
                      className="min-h-[120px] bg-white border-gray-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-900">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
