import { configureStore } from '@reduxjs/toolkit'
import newsletterReducer from './slices/newsletterSlice'
import contactReducer from './slices/contactSlice'
import uiReducer from './slices/uiSlice'
import authReducer from './slices/authSlice'
import siteContentReducer from './slices/siteContentSlice'
import googleReviewsReducer from './slices/googleReviewsSlice'

export const store = configureStore({
  reducer: {
    newsletter: newsletterReducer,
    contact: contactReducer,
    ui: uiReducer,
    auth: authReducer,
    siteContent: siteContentReducer,
    googleReviews: googleReviewsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
