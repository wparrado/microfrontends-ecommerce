<template>
  <div class="cart-item">
    <span class="item-image">{{ item.image }}</span>
    <div class="item-info">
      <p class="item-name">{{ item.name }}</p>
      <p class="item-price">${{ item.price }}</p>
    </div>
    <button @click="$emit('remove', item.id)" class="remove-btn">✕</button>
  </div>
</template>

<script>
export default {
  name: 'CartItem',
  props: {
    item: { type: Object, required: true },
  },
  emits: ['remove'],
}
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
}
.item-image { font-size: 2rem; }
.item-info { flex: 1; }
.item-name { margin: 0; font-weight: 600; }
.item-price { margin: 0; color: #0070f3; }
.remove-btn {
  background: none;
  border: 1px solid #e53e3e;
  color: #e53e3e;
  border-radius: 4px;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
}
</style>
