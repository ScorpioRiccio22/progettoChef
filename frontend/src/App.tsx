import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store } from '@/store'
import { muiTheme } from '@/theme'
import Layout from '@/components/layout/Layout'
import ScrollToTop from '@/components/layout/ScrollToTop'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import RecipesPage from '@/pages/RecipesPage'
import EventsPage from '@/pages/EventsPage'
import ContactPage from '@/pages/ContactPage'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Sito pubblico, con navbar/footer */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/chi-siamo" element={<AboutPage />} />
              <Route path="/ricettario" element={<RecipesPage />} />
              <Route path="/eventi" element={<EventsPage />} />
              <Route path="/contatti" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Area admin: login pubblico + sezione protetta da JWT */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboardPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}
