// Recensioni Google del locale, lette dal backend (package
// it.andreamoiochef.backend.reviews). L'endpoint è pubblico e non richiede
// né restituisce mai alcuna chiave API: quella resta configurata solo lato
// server come variabile d'ambiente (vedi backend/README.md).

import api from '@/services/api'
import type { GoogleReviewsResponse } from '@/types'

export const publicGetGoogleReviews = () =>
  api.get<GoogleReviewsResponse>('/public/google-reviews').then((r) => r.data)
