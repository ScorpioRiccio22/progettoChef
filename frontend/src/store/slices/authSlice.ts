import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Stato di autenticazione per l'area /admin. In questa fase il login è mock:
// genera un token finto con la stessa forma (struttura) di un vero JWT, così
// quando il backend Spring Boot sarà pronto basterà sostituire `mockLogin`
// con una vera chiamata a POST /api/auth/login — la UI non dovrà cambiare.

export interface AdminUser {
  username: string
  role: 'admin'
}

interface AuthState {
  token: string | null
  user: AdminUser | null
  status: 'idle' | 'loading' | 'error'
  error: string | null
}

const TOKEN_STORAGE_KEY = 'chefproject_admin_token'

const initialState: AuthState = {
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
  user: localStorage.getItem(TOKEN_STORAGE_KEY) ? { username: 'admin', role: 'admin' } : null,
  status: 'idle',
  error: null,
}

// Credenziali mock — quando arriva il backend reale questa funzione verrà
// sostituita da una chiamata a src/services/api.ts (POST /api/auth/login).
function mockLogin(username: string, password: string): Promise<{ token: string; user: AdminUser }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'andrea' && password === 'andrea123') {
        // Token finto ma "shaped like" un JWT (header.payload.signature in base64)
        const fakePayload = btoa(JSON.stringify({ sub: username, role: 'admin', iat: Date.now() }))
        const fakeToken = `mock.${fakePayload}.signature`
        resolve({ token: fakeToken, user: { username, role: 'admin' } })
      } else {
        reject(new Error('Credenziali non valide'))
      }
    }, 500)
  })
}

export const loginAdmin = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }) => {
    return mockLogin(username, password)
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<{ token: string; user: AdminUser }>) => {
        state.status = 'idle'
        state.token = action.payload.token
        state.user = action.payload.user
        localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token)
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.error.message ?? 'Errore di login'
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
