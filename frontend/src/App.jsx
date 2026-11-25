import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { nav } from './data/content'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import { ToastProvider } from './components/ui/Toast'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'
import ResourceDetailPage from './pages/ResourceDetailPage'
import ResourceFormPage from './pages/ResourceFormPage'
import ResourceListPage from './pages/ResourceListPage'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <a className="skip-link" href="#main">
          {nav.skip}
        </a>
        <Navbar />
        <main id="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:resource" element={<ResourceListPage />} />
            <Route path="/:resource/new" element={<ResourceFormPage mode="create" />} />
            <Route path="/:resource/:id" element={<ResourceDetailPage />} />
            <Route path="/:resource/:id/edit" element={<ResourceFormPage mode="edit" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </ToastProvider>
    </BrowserRouter>
  )
}
