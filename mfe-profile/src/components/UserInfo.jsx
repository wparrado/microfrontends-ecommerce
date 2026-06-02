import React from 'react'

export default function UserInfo({ user }) {
  return (
    <div style={{
      display: 'flex',
      gap: '1.5rem',
      background: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      alignItems: 'center',
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        color: 'white',
      }}>
        {user.avatar}
      </div>
      <div>
        <h3 style={{ margin: '0 0 0.25rem' }}>{user.name}</h3>
        <p style={{ margin: '0 0 0.25rem', color: '#666' }}>{user.email}</p>
        <p style={{ margin: 0, color: '#999', fontSize: '0.85rem' }}>
          Miembro desde {user.memberSince}
        </p>
      </div>
    </div>
  )
}
