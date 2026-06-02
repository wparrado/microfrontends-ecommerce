import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const unsubscribe = window.__APP_STORE__.subscribe(store => {
      setCartCount(store.cartCount)
    })
    return unsubscribe
  }, [])

  const linkStyle = (path) => ({
    marginRight: '1rem',
    textDecoration: 'none',
    color: location.pathname.startsWith(path) ? '#0070f3' : '#333',
    fontWeight: location.pathname.startsWith(path) ? 'bold' : 'normal',
  })

  return (
    <nav style={{
      padding: '1rem 2rem',
      borderBottom: '2px solid #eee',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <span style={{ fontWeight: 'bold', fontSize: '1.2rem', marginRight: '2rem' }}>
        MFE Shop
      </span>
      <Link to="/catalog" style={linkStyle('/catalog')}>Catálogo</Link>
      <Link to="/cart" style={linkStyle('/cart')}>
        Carrito {cartCount > 0 && (
          <span style={{
            background: '#e53e3e',
            color: 'white',
            borderRadius: '50%',
            padding: '0 6px',
            fontSize: '0.8rem',
            marginLeft: '4px',
          }}>
            {cartCount}
          </span>
        )}
      </Link>
      <Link to="/profile" style={linkStyle('/profile')}>Perfil</Link>
    </nav>
  )
}
