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
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminAboutPage from '@/pages/admin/AdminAboutPage'
import AdminDishesPage from '@/pages/admin/AdminDishesPage'
import AdminEventsPage from '@/pages/admin/AdminEventsPage'
import AdminServicesPage from '@/pages/admin/AdminServicesPage'
import AdminContactPage from '@/pages/admin/AdminContactPage'
import AdminNewsletterPage from '@/pages/admin/AdminNewsletterPage'

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/chi-siamo" element={<AboutPage />} />
              <Route path="/ricettario" element={<RecipesPage />} />
              <Route path="/eventi" element={<EventsPage />} />
              <Route path="/contatti" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Area amministrativa, protetta da login mock */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="about" element={<AdminAboutPage />} />
                <Route path="dishes" element={<AdminDishesPage />} />
                <Route path="events" element={<AdminEventsPage />} />
                <Route path="services" element={<AdminServicesPage />} />
                <Route path="contact" element={<AdminContactPage />} />
                <Route path="newsletter" element={<AdminNewsletterPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}
