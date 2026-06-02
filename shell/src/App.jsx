import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import CartWrapper from './remotes/CartWrapper'

// React.lazy: the import() resolves at runtime by downloading remoteEntry.js.
// The shell bundle does NOT contain catalog or profile code.
const CatalogApp = React.lazy(() => import('catalog/CatalogApp'))
const ProfileApp = React.lazy(() => import('profile/ProfileApp'))

const Loading = () => (
  <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
    Cargando microfrontend...
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Navigate to="/catalog" replace />} />
            <Route path="/catalog/*" element={<CatalogApp />} />
            <Route path="/cart/*" element={<CartWrapper />} />
            <Route path="/profile/*" element={<ProfileApp />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  )
}
