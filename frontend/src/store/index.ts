import { configureStore } from '@reduxjs/toolkit'
import newsletterReducer from './slices/newsletterSlice'
import contactReducer from './slices/contactSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    newsletter: newsletterReducer,
    contact: contactReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
