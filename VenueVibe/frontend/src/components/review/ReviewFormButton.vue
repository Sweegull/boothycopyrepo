<template>
  <div class="card h-100 shadow-sm"style="background-color:rgba(255,255,255,0.9)">
    <div class="card-body">
      <h2>Submit Your Review</h2>
      <button 
        class="btn green-btn" 
        @click="$emit('openModal')"
        :disabled="loading"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Open Review Form
      </button>
    </div>
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