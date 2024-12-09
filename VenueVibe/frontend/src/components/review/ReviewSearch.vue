# ReviewSearch.vue
<template>
  <div class="col-md-6" >
    <div class="card h-100 shadow-sm" style="background-color:rgba(255,255,255,0.9)">
      <div class="card-body" >
        <h2>Search For Event Data & Reviews</h2>
        <form @submit.prevent="handleSearch">
          <div class="input-group mb-3">
            <input 
              type="text" 
              v-model="searchInput" 
              class="form-control" 
              placeholder="Copy & paste event code (case sensitive)" 
              required 
              :disabled="loading"
            />
            <button 
              class="btn green-btn" 
              type="submit"
              :disabled="loading"
            >
              <i class="bi bi-search me-1"></i>
              Search
            </button>
          </div>
          <p class="button-info text-muted">
            (eg. NAONOV'24 , XMASMART2022)
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  searchId: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:searchId', 'search']);

const searchInput = ref(props.searchId);

// Watch for external changes to searchId
watch(() => props.searchId, (newValue) => {
  searchInput.value = newValue;
});

// Watch for local changes to searchInput
watch(searchInput, (newValue) => {
  emit('update:searchId', newValue);
});

const handleSearch = () => {
  emit('search');
};
</script>

<style src="@/styles/review.css" scoped />

