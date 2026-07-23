import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import api, { ADMIN_TOKEN_STORAGE_KEY } from '@/services/api'
import type { AdminUser, LoginFormValues, LoginResponse } from '@/types'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error'

interface AuthState {
  user: AdminUser | null
  token: string | null
  status: AuthStatus
  error: string | null
  // true mentre verifichiamo un token già salvato (refresh pagina) prima di
  // decidere se mostrare l'area admin o il login.
  isBootstrapping: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY),
  status: 'idle',
  error: null,
  isBootstrapping: Boolean(localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)),
}

function extractErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (response?.data?.message) return response.data.message
  }
  return fallback
}

export const login = createAsyncThunk(
  'auth/login',
  async (values: LoginFormValues, { rejectWithValue }) => {
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', values)
      return data
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Email o password non corretti'))
    }
  },
)

// Richiamato all'avvio dell'app se in localStorage c'è già un token, per
// verificarne la validità e recuperare i dati dell'admin senza richiedere
// di nuovo le credenziali a ogni refresh della pagina.
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_: void, { rejectWithValue }) => {
    try {
      const { data } = await api.get<AdminUser>('/auth/me')
      return data
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error, 'Sessione non valida'))
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
      state.user = null
      state.token = null
      state.status = 'idle'
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.status = 'authenticated'
        state.user = action.payload.user
        state.token = action.payload.accessToken
        localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, action.payload.accessToken)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error'
        state.error = (action.payload as string) ?? 'Errore di accesso'
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isBootstrapping = true
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<AdminUser>) => {
        state.user = action.payload
        state.status = 'authenticated'
        state.isBootstrapping = false
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        // Token assente/scaduto/non valido: torniamo allo stato "sloggato".
        localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY)
        state.user = null
        state.token = null
        state.status = 'idle'
        state.isBootstrapping = false
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
