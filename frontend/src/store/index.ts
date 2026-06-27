import { configureStore } from '@reduxjs/toolkit'
import newsletterReducer from './slices/newsletterSlice'
import contactReducer from './slices/contactSlice'
import uiReducer from './slices/uiSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    newsletter: newsletterReducer,
    contact: contactReducer,
    ui: uiReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
