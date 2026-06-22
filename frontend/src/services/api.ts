import axios from 'axios'

// Quando il backend Spring Boot sarà disponibile, impostare VITE_API_BASE_URL
// nel file .env (es. http://localhost:8080/api). Per ora il client è
// configurato ma non viene ancora richiamato da nessuna pagina: i form usano
// thunk "mock" in store/slices.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

export default api
