import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { publicSubscribeNewsletter } from '@/services/leadsApi'
import type { SubmissionStatus } from '@/types'

interface NewsletterState {
  status: SubmissionStatus
  error: string | null
}

const initialState: NewsletterState = {
  status: 'idle',
  error: null,
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (response?.data?.message) return response.data.message
  }
  return fallback
}

export const subscribeToNewsletter = createAsyncThunk(
  'newsletter/subscribe',
  async (email: string, { rejectWithValue }) => {
    try {
      await publicSubscribeNewsletter(email)
      return { email }
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Si è verificato un errore. Riprova più tardi.'))
    }
  },
)

const newsletterSlice = createSlice({
  name: 'newsletter',
  initialState,
  reducers: {
    resetNewsletterStatus(state) {
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeToNewsletter.pending, (state) => {
        state.status = 'submitting'
        state.error = null
      })
      .addCase(subscribeToNewsletter.fulfilled, (state) => {
        state.status = 'success'
      })
      .addCase(subscribeToNewsletter.rejected, (state, action) => {
        state.status = 'error'
        state.error = (action.payload as string) ?? 'Si è verificato un errore.'
      })
  },
})

export const { resetNewsletterStatus } = newsletterSlice.actions
export default newsletterSlice.reducer
