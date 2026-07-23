import axios from 'axios'

// Quando il backend Spring Boot è disponibile, impostare VITE_API_BASE_URL
// nel file .env (es. http://localhost:8080/api). In sviluppo locale senza
// Docker, Vite fa già da proxy su /api verso localhost:8080 (vedi vite.config.ts).
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const ADMIN_TOKEN_STORAGE_KEY = 'admin_access_token'

// Allega automaticamente il token JWT dell'area admin (se presente) a ogni
// richiesta. I form pubblici (newsletter, contatti) non hanno un token e la
// richiesta parte semplicemente senza header Authorization.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Se il token è scaduto o non valido, il backend risponde 401: puliamo il
// token salvato così la prossima navigazione nell'area admin richiede di
// nuovo il login, invece di restare in uno stato "autenticato" incoerente.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
    }
    return Promise.reject(error)
  },
)

export default api
