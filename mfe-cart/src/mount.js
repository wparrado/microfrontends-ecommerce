import { createApp } from 'vue'
import CartApp from './CartApp.vue'

export function mount(el) {
  const app = createApp(CartApp)
  app.mount(el)
  return app
}

export function unmount(app) {
  app.unmount()
}
