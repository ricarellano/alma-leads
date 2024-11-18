'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar } from '@/components/ui/avatar'
import { RootState, AppDispatch } from '@/lib/store'
import { fetchLeads, updateLeadStatus } from '@/lib/features/leadsSlice'

const ITEMS_PER_PAGE = 10

export default function LeadsPage() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { leads, status, error } = useSelector((state: RootState) => state.leads)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/admin/login')
      } else {
        dispatch(fetchLeads())
      }
    }
    checkAuth()
  }, [dispatch, router])

  const handleStatusChange = async (leadId: string) => {
    try {
      await dispatch(updateLeadStatus({ id: leadId, status: 'REACHED_OUT' })).unwrap()
    } catch (error) {
      console.error('Failed to update lead status:', error)
    }
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE)
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (status === 'failed') {
    return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#F9FFEA] border-r border-gray-100">
        <div className="p-6">
         <Link href="/">
            <h1 className="text-2xl font-bold">almă</h1>
         </Link> 
        </div>
        <nav className="mt-6 space-y-1">
          <a 
            href="/admin/leads" 
            className="flex items-center px-6 py-3 text-sm font-medium text-gray-900 bg-white"
          >
            Leads
          </a>
          <a 
            href="/admin/settings" 
            className="flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:bg-white/50"
          >
            Settings
          </a>
        </nav>
        <div className="absolute bottom-8 left-6 flex items-center gap-3">
          <Avatar className="h-8 w-8 bg-gray-200">
            <span className="text-sm">A</span>
          </Avatar>
          <span className="text-sm font-medium">Admin</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-white">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold">Leads</h1>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search" 
                  className="pl-10 w-[240px] bg-white border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] bg-white border-gray-200">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reached_out">Reached Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-medium text-gray-500">
                    Name <ChevronDown className="inline-block ml-1 h-4 w-4" />
                  </TableHead>
                  <TableHead className="font-medium text-gray-500">
                    Submitted <ChevronDown className="inline-block ml-1 h-4 w-4" />
                  </TableHead>
                  <TableHead className="font-medium text-gray-500">
                    Status <ChevronDown className="inline-block ml-1 h-4 w-4" />
                  </TableHead>
                  <TableHead className="font-medium text-gray-500">
                    Country <ChevronDown className="inline-block ml-1 h-4 w-4" />
                  </TableHead>
                  <TableHead className="font-medium text-gray-500">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{`${lead.firstName} ${lead.lastName}`}</TableCell>
                    <TableCell>
                      {new Date(lead.submitted).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        lead.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {lead.status}
                      </span>
                    </TableCell>
                    <TableCell>{lead.country}</TableCell>
                    <TableCell>
                      {lead.status === 'PENDING' && (
                        <Button
                          onClick={() => handleStatusChange(lead.id)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          Mark as Reached Out
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-end gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="outline"
                size="icon"
                className={`h-8 w-8 ${currentPage === page ? 'bg-gray-900 text-white' : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
