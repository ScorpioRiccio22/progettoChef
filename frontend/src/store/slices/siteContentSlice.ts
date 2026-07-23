import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  publicGetAboutPage,
  publicGetActiveMenu,
  publicGetSiteSettings,
  publicGetSiteTexts,
  publicListDishes,
  publicListEventTypes,
  publicListServices,
  publicListTestimonials,
} from '@/services/contentApi'
import type {
  AboutPageContent,
  Dish,
  EventType,
  Menu,
  ServiceOffering,
  SiteSettings,
  Testimonial,
} from '@/types'

interface SiteContentState {
  settings: SiteSettings | null
  services: ServiceOffering[]
  dishes: Dish[]
  /** Il menu "A Modo Mio" attivo in questo momento per il negozio fisico (null se nessuno). */
  activeMenu: Menu | null
  /** Il menu attivo in questo momento per gli eventi (null se nessuno). */
  activeEventsMenu: Menu | null
  eventTypes: EventType[]
  testimonials: Testimonial[]
  about: AboutPageContent | null
  /** Testi configurabili del sito (titoli, descrizioni, testo dei pulsanti...), chiave -> valore. */
  texts: Record<string, string>
  status: 'idle' | 'loading' | 'loaded' | 'error'
  error: string | null
}

const initialState: SiteContentState = {
  settings: null,
  services: [],
  dishes: [],
  activeMenu: null,
  activeEventsMenu: null,
  eventTypes: [],
  testimonials: [],
  about: null,
  texts: {},
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
  const [settings, services, dishes, activeMenu, activeEventsMenu, eventTypes, testimonials, about, texts] =
    await Promise.all([
      publicGetSiteSettings(),
      publicListServices(),
      publicListDishes(),
      publicGetActiveMenu('SHOP'),
      publicGetActiveMenu('EVENTS'),
      publicListEventTypes(),
      publicListTestimonials(),
      publicGetAboutPage(),
      publicGetSiteTexts(),
    ])
  return { settings, services, dishes, activeMenu, activeEventsMenu, eventTypes, testimonials, about, texts }
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
        state.activeMenu = action.payload.activeMenu
        state.activeEventsMenu = action.payload.activeEventsMenu
        state.eventTypes = action.payload.eventTypes
        state.testimonials = action.payload.testimonials
        state.about = action.payload.about
        state.texts = action.payload.texts
      })
      .addCase(loadSiteContent.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message ?? 'Impossibile caricare i contenuti del sito'
      })
  },
})

export default siteContentSlice.reducer
