import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { ContactFormValues, SubmissionStatus } from '@/types'

interface ContactState {
  status: SubmissionStatus
  error: string | null
}

const initialState: ContactState = {
  status: 'idle',
  error: null,
}

// MOCK: simula l'invio del form. Quando il backend sarà pronto, sostituire
// con: await api.post('/contact', values)
export const sendContactMessage = createAsyncThunk(
  'contact/send',
  async (values: ContactFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1100))
    if (!values.email.includes('@')) {
      throw new Error('Email non valida')
    }
    return values
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
        state.error = action.error.message ?? 'Si è verificato un errore.'
      })
  },
})

export const { resetContactStatus } = contactSlice.actions
export default contactSlice.reducer
