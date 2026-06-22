import { configureStore } from '@reduxjs/toolkit'
import newsletterReducer from './slices/newsletterSlice'
import contactReducer from './slices/contactSlice'
import uiReducer from './slices/uiSlice'
import authReducer from './slices/authSlice'
import contentReducer from './slices/contentSlice'

export const store = configureStore({
  reducer: {
    newsletter: newsletterReducer,
    contact: contactReducer,
    ui: uiReducer,
    auth: authReducer,
    content: contentReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
