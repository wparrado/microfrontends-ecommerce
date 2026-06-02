import React, { useRef, useEffect } from 'react'

export default function CartWrapper() {
  const containerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    let vueApp = null

    import('cart/CartApp').then(({ mount }) => {
      if (!cancelled && containerRef.current) {
        vueApp = mount(containerRef.current)
      }
    })

    return () => {
      cancelled = true
      if (vueApp) vueApp.unmount()
    }
  }, [])

  return <div ref={containerRef} style={{ minHeight: '400px' }} />
}
