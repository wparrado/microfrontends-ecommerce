import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Shared state: allows MFEs to update the cart badge in Navbar
// without importing anything from shell. Minimal reactive event bus.
window.__APP_STORE__ = {
  cartCount: 0,
  listeners: [],
  subscribe(fn) {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn)
    }
  },
  update(data) {
    Object.assign(this, data)
    this.listeners.forEach(fn => fn(this))
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
