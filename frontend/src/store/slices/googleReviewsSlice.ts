import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { publicGetGoogleReviews } from '@/services/reviewsApi'
import type { GoogleReviewsResponse } from '@/types'

interface GoogleReviewsState {
  data: GoogleReviewsResponse | null
  status: 'idle' | 'loading' | 'loaded' | 'error'
}

const initialState: GoogleReviewsState = {
  data: null,
  status: 'idle',
}

/**
 * Caricamento separato da loadSiteContent: la chiamata a Google può essere
 * più lenta o momentaneamente non disponibile, e non deve bloccare il resto
 * del sito. In caso di errore la sezione recensioni mostra semplicemente le
 * testimonianze manuali come fallback (vedi GoogleReviewsSection).
 */
export const loadGoogleReviews = createAsyncThunk('googleReviews/load', () => publicGetGoogleReviews())

const googleReviewsSlice = createSlice({
  name: 'googleReviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadGoogleReviews.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadGoogleReviews.fulfilled, (state, action) => {
        state.status = 'loaded'
        state.data = action.payload
      })
      .addCase(loadGoogleReviews.rejected, (state) => {
        state.status = 'error'
        state.data = null
      })
  },
})

export default googleReviewsSlice.reducer
