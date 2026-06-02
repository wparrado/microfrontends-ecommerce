<template>
  <div>
    <div class="mfe-badge">
      <strong>mfe-cart</strong> — Vue 3 · puerto :3002 · escucha CustomEvent <code>add-to-cart</code>
    </div>

    <h2>Carrito de Compras</h2>

    <div v-if="items.length === 0" class="empty-state">
      Tu carrito está vacío. Ve al catálogo y agrega productos.
    </div>

    <div v-else class="cart-content">
      <div class="items-list">
        <CartItem
          v-for="item in items"
          :key="item.cartId"
          :item="item"
          @remove="removeItem"
        />
      </div>
      <div class="cart-summary">
        <p>Subtotal: <strong>${{ total }}</strong></p>
        <p>Items: <strong>{{ items.length }}</strong></p>
        <button class="checkout-btn">Proceder al pago</button>
      </div>
    </div>
  </div>
</template>

<script>
import CartItem from './components/CartItem.vue'

export default {
  name: 'CartApp',
  components: { CartItem },
  data() {
    return {
      items: [],
      nextCartId: 1,
    }
  },
  computed: {
    total() {
      return this.items.reduce((sum, item) => sum + item.price, 0)
    },
  },
  mounted() {
    // Los CustomEvents son efímeros: si CartApp no está montado cuando se disparan,
    // los items se pierden. __APP_STORE__ persiste entre navegaciones, por eso
    // es la fuente de verdad para los items del carrito.
    if (window.__APP_STORE__) {
      this.items = [...(window.__APP_STORE__.cartItems || [])]
      this._storeUnsub = window.__APP_STORE__.subscribe(store => {
        this.items = [...(store.cartItems || [])]
      })
    }
  },
  beforeUnmount() {
    if (this._storeUnsub) this._storeUnsub()
  },
  methods: {
    removeItem(cartId) {
      if (window.__APP_STORE__) {
        const cartItems = window.__APP_STORE__.cartItems.filter(i => i.cartId !== cartId)
        window.__APP_STORE__.update({
          cartItems,
          cartCount: Math.max(0, cartItems.length),
        })
      }
    },
  },
}
</script>

<style scoped>
.mfe-badge {
  background: linear-gradient(135deg, #41b883 0%, #35495e 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
}
.empty-state {
  color: #999;
  text-align: center;
  padding: 3rem;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
}
.cart-content { display: flex; gap: 2rem; }
.items-list { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }
.cart-summary {
  width: 200px;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  height: fit-content;
}
.checkout-btn {
  width: 100%;
  background: #38a169;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}
</style>
