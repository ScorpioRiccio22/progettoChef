import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  publicGetAboutPage,
  publicGetSiteSettings,
  publicListDishes,
  publicListEventTypes,
  publicListServices,
  publicListTestimonials,
} from '@/services/contentApi'
import type {
  AboutPageContent,
  Dish,
  EventType,
  ServiceOffering,
  SiteSettings,
  Testimonial,
} from '@/types'

interface SiteContentState {
  settings: SiteSettings | null
  services: ServiceOffering[]
  dishes: Dish[]
  eventTypes: EventType[]
  testimonials: Testimonial[]
  about: AboutPageContent | null
  status: 'idle' | 'loading' | 'loaded' | 'error'
  error: string | null
}

const initialState: SiteContentState = {
  settings: null,
  services: [],
  dishes: [],
  eventTypes: [],
  testimonials: [],
  about: null,
  status: 'idle',
  error: null,
}

/**
 * Carica in parallelo tutti i contenuti pubblici del sito. Viene lanciata
 * una sola volta all'avvio dell'app (vedi src/App.tsx): da quel momento i
 * componenti pubblici leggono questi dati dallo store invece che dalle
 * vecchie costanti statiche in lib/content.ts.
 */
export const loadSiteContent = createAsyncThunk('siteContent/load', async () => {
  const [settings, services, dishes, eventTypes, testimonials, about] = await Promise.all([
    publicGetSiteSettings(),
    publicListServices(),
    publicListDishes(),
    publicListEventTypes(),
    publicListTestimonials(),
    publicGetAboutPage(),
  ])
  return { settings, services, dishes, eventTypes, testimonials, about }
})

const siteContentSlice = createSlice({
  name: 'siteContent',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSiteContent.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loadSiteContent.fulfilled, (state, action) => {
        state.status = 'loaded'
        state.settings = action.payload.settings
        state.services = action.payload.services
        state.dishes = action.payload.dishes
        state.eventTypes = action.payload.eventTypes
        state.testimonials = action.payload.testimonials
        state.about = action.payload.about
      })
      .addCase(loadSiteContent.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message ?? 'Impossibile caricare i contenuti del sito'
      })
  },
})

export default siteContentSlice.reducer
