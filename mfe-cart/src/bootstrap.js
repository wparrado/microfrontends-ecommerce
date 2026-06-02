import { createApp } from 'vue'
import CartApp from './CartApp.vue'

const el = document.getElementById('root')
if (el) {
  createApp(CartApp).mount(el)
}
