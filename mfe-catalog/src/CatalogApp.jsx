import React from 'react'
import ProductCard from './components/ProductCard'

const PRODUCTS = [
  { id: 1, name: 'Laptop Pro', price: 1299, description: 'Laptop de alta performance', image: '💻' },
  { id: 2, name: 'Mouse Inalámbrico', price: 49, description: 'Ergonómico y preciso', image: '🖱️' },
  { id: 3, name: 'Teclado Mecánico', price: 129, description: 'Switches Cherry MX Blue', image: '⌨️' },
  { id: 4, name: 'Monitor 4K', price: 499, description: '27 pulgadas, 144Hz', image: '🖥️' },
  { id: 5, name: 'Auriculares BT', price: 89, description: 'Cancelación de ruido', image: '🎧' },
  { id: 6, name: 'Webcam HD', price: 79, description: '1080p, 60fps', image: '📷' },
]

export default function CatalogApp() {
  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        fontSize: '0.85rem',
      }}>
        <strong>mfe-catalog</strong> — React 18 · puerto :3001 · cargado vía remoteEntry.js en runtime
      </div>
      <h2 style={{ marginBottom: '1.5rem' }}>Catálogo de Productos</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
      }}>
        {PRODUCTS.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
