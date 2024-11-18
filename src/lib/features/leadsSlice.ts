import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  linkedin: string
  visaInterest: string
  resume: File | null
  additionalInfo: string
  status: 'PENDING' | 'REACHED_OUT'
  submitted: string
  country: string
}

interface LeadsState {
  leads: Lead[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: LeadsState = {
  leads: [],
  status: 'idle',
  error: null
}

export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/leads')
      if (!response.ok) {
        throw new Error('Failed to fetch leads')
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const addLead = createAsyncThunk(
  'leads/addLead',
  async (leadData: Omit<Lead, 'id' | 'status' | 'submitted' | 'country'>, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      Object.entries(leadData).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value, value.name)
        } else {
          formData.append(key, value as string)
        }
      })

      const response = await fetch('/api/leads', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to add lead')
      }

      return await response.json()
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updateLeadStatus = createAsyncThunk(
  'leads/updateLeadStatus',
  async ({ id, status }: { id: string; status: 'PENDING' | 'REACHED_OUT' }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })
      if (!response.ok) {
        throw new Error('Failed to update lead status')
      }
      return await response.json()
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    resetLeadsStatus: (state) => {
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchLeads.fulfilled, (state, action: PayloadAction<Lead[]>) => {
        state.status = 'succeeded'
        state.leads = action.payload
        state.error = null
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string || 'Failed to fetch leads'
      })
      .addCase(addLead.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(addLead.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.status = 'succeeded'
        state.leads.push(action.payload)
        state.error = null
      })
      .addCase(addLead.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string || 'Failed to add lead'
      })
      .addCase(updateLeadStatus.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(updateLeadStatus.fulfilled, (state, action: PayloadAction<Lead>) => {
        state.status = 'succeeded'
        const updatedLead = action.payload
        const index = state.leads.findIndex((lead) => lead.id === updatedLead.id)
        if (index !== -1) {
          state.leads[index] = {
            ...state.leads[index],
            ...updatedLead,
          }
        }
        state.error = null
      })
      .addCase(updateLeadStatus.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string || 'Failed to update lead status'
      })
  },
})

export const { resetLeadsStatus } = leadsSlice.actions
export default leadsSlice.reducer
