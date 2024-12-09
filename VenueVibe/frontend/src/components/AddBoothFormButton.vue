<template>
  <div class="card h-100 shadow-sm">
      <button 
        class="btn green-btn" 
        @click="$emit('openModal')"
        :disabled="loading"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Add New Booth
      </button>
  </div>
</template>

<script setup>
defineProps({
loading: {
  type: Boolean,
  default: false
}
});

defineEmits(['openModal']);
</script>

<style src="@/styles/review.css" scoped />