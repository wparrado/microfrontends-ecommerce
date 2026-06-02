import React, { useRef, useEffect } from 'react'

export default function CartWrapper() {
  const containerRef = useRef(null)

  useEffect(() => {
    let vueApp = null

    import('cart/CartApp').then(({ mount }) => {
      if (containerRef.current) {
        vueApp = mount(containerRef.current)
      }
    })

    return () => {
      if (vueApp) vueApp.unmount()
    }
  }, [])

  return <div ref={containerRef} style={{ minHeight: '400px' }} />
}
