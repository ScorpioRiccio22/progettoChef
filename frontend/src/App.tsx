import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { store } from '@/store'
import { useAppDispatch } from '@/hooks/redux'
import { loadSiteContent } from '@/store/slices/siteContentSlice'
import { loadGoogleReviews } from '@/store/slices/googleReviewsSlice'
import { muiTheme } from '@/theme'
import Layout from '@/components/layout/Layout'
import ScrollToTop from '@/components/layout/ScrollToTop'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import RecipesPage from '@/pages/RecipesPage'
import EventsPage from '@/pages/EventsPage'
import ContactPage from '@/pages/ContactPage'
import ServicesPage from '@/pages/ServicesPage'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminLoginPage from '@/pages/admin/AdminLoginPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminSiteSettingsPage from '@/pages/admin/AdminSiteSettingsPage'
import AdminServicesPage from '@/pages/admin/AdminServicesPage'
import AdminDishesPage from '@/pages/admin/AdminDishesPage'
import AdminEventsPage from '@/pages/admin/AdminEventsPage'
import AdminTestimonialsPage from '@/pages/admin/AdminTestimonialsPage'
import AdminAboutPage from '@/pages/admin/AdminAboutPage'
import AdminMessagesPage from '@/pages/admin/AdminMessagesPage'
import AdminNewsletterPage from '@/pages/admin/AdminNewsletterPage'
import AdminAccountsPage from '@/pages/admin/AdminAccountsPage'

function ContentLoader() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(loadSiteContent())
    dispatch(loadGoogleReviews())
  }, [dispatch])
  return null
}

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <BrowserRouter>
          <ContentLoader />
          <ScrollToTop />
          <Routes>
            {/* Sito pubblico, con navbar/footer */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/chi-siamo" element={<AboutPage />} />
              <Route path="/ricettario" element={<RecipesPage />} />
              <Route path="/eventi" element={<EventsPage />} />
              <Route path="/servizi" element={<ServicesPage />} />
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
              <Route path="impostazioni" element={<AdminSiteSettingsPage />} />
              <Route path="servizi" element={<AdminServicesPage />} />
              <Route path="ricettario" element={<AdminDishesPage />} />
              <Route path="eventi" element={<AdminEventsPage />} />
              <Route path="testimonianze" element={<AdminTestimonialsPage />} />
              <Route path="chi-siamo" element={<AdminAboutPage />} />
              <Route path="messaggi" element={<AdminMessagesPage />} />
              <Route path="newsletter" element={<AdminNewsletterPage />} />
              <Route
                path="account"
                element={
                  <ProtectedRoute roles={['SUPERADMIN']}>
                    <AdminAccountsPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}
