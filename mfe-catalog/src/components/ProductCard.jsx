import React from 'react'

export default function ProductCard({ product }) {
  const handleAddToCart = () => {
    window.dispatchEvent(new CustomEvent('add-to-cart', {
      detail: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
    }))

    if (window.__APP_STORE__) {
      window.__APP_STORE__.update({
        cartCount: window.__APP_STORE__.cartCount + 1,
      })
    }
  }

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{
        height: '160px',
        background: '#f7fafc',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
      }}>
        {product.image}
      </div>
      <h3 style={{ margin: 0, fontSize: '1rem' }}>{product.name}</h3>
      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>{product.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', color: '#0070f3', fontSize: '1.1rem' }}>
          ${product.price}
        </span>
        <button
          onClick={handleAddToCart}
          style={{
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          Agregar
        </button>
      </div>
    </div>
  )
}
