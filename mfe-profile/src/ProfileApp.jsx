import React from 'react'
import UserInfo from './components/UserInfo'

const USER = {
  name: 'Ana García',
  email: 'ana.garcia@example.com',
  memberSince: 'Enero 2023',
  avatar: '👩‍💻',
  orders: 12,
  wishlist: 5,
}

export default function ProfileApp() {
  return (
    <div>
      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem',
        fontSize: '0.85rem',
      }}>
        <strong>mfe-profile</strong> — React 18 · puerto :3003 · cargado vía remoteEntry.js en runtime
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Mi Perfil</h2>

      <UserInfo user={USER} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginTop: '1.5rem',
      }}>
        {[
          { label: 'Pedidos realizados', value: USER.orders, icon: '📦' },
          { label: 'Lista de deseos', value: USER.wishlist, icon: '❤️' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3' }}>
              {stat.value}
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
