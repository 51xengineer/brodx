import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import { ThemeProvider } from './context/ThemeContext'

// Lazy load pages for performance optimization
const LandingPage = lazy(() => import('./pages/LandingPage'))
const ServicePage = lazy(() => import('./pages/ServicesPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))
const BookCall = lazy(() => import('./pages/BookACall'))
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ErrorPage = lazy(() => import('./pages/ErrorPage'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))

const AppContent: React.FC = () => {
  const navigate = useNavigate()
  const [selectedService, setSelectedService] = React.useState<any>(null) // Added selectedService state

  return (
    <MainLayout>
      <Suspense fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-background relative z-[1000]">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<LandingPage onExplore={() => navigate('/services')} />} />
          <Route path="/services" element={<ServicePage onSelectService={(s: any) => { setSelectedService(s); navigate(`/services/${s.id}`) }} />} />
          <Route path="/services/:id" element={<ServiceDetail service={selectedService} onBack={() => navigate('/services')} />} /> {/* Added ServiceDetail route */}
          <Route path="/neeraj-vault" element={<AdminDashboard />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/book-call" element={<BookCall />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          {/* Catch all for potential broken links */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </MainLayout>
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  )
}

export default App
