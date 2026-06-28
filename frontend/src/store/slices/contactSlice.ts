import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { publicSendContactMessage } from '@/services/leadsApi'
import type { ContactFormValues, SubmissionStatus } from '@/types'

interface ContactState {
  status: SubmissionStatus
  error: string | null
}

const initialState: ContactState = {
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

export const sendContactMessage = createAsyncThunk(
  'contact/send',
  async (values: ContactFormValues, { rejectWithValue }) => {
    try {
      await publicSendContactMessage(values)
      return values
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Si è verificato un errore. Riprova più tardi.'))
    }
  },
)

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetContactStatus(state) {
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContactMessage.pending, (state) => {
        state.status = 'submitting'
        state.error = null
      })
      .addCase(sendContactMessage.fulfilled, (state) => {
        state.status = 'success'
      })
      .addCase(sendContactMessage.rejected, (state, action) => {
        state.status = 'error'
        state.error = (action.payload as string) ?? 'Si è verificato un errore.'
      })
  },
})

export const { resetContactStatus } = contactSlice.actions
export default contactSlice.reducer
