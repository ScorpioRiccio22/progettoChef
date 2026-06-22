import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { SubmissionStatus } from '@/types'
import { addNewsletterSubscriber } from './contentSlice'

interface NewsletterState {
  status: SubmissionStatus
  error: string | null
}

const initialState: NewsletterState = {
  status: 'idle',
  error: null,
}

// MOCK: simula una chiamata API. Quando il backend Spring Boot sarà pronto,
// sostituire il corpo con: await api.post('/newsletter', { email })
// Il backend si occuperà di salvare il subscriber e inviare email di conferma.
export const subscribeToNewsletter = createAsyncThunk(
  'newsletter/subscribe',
  async (email: string, { dispatch }) => {
    await new Promise((resolve) => setTimeout(resolve, 900))
    if (!email.includes('@')) {
      throw new Error('Email non valida')
    }
    // Salva anche nel contentSlice per mostrarla nell'admin
    dispatch(addNewsletterSubscriber(email))
    return { email }
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
        state.error = action.error.message ?? 'Si è verificato un errore.'
      })
  },
})

export const { resetNewsletterStatus } = newsletterSlice.actions
export default newsletterSlice.reducer
