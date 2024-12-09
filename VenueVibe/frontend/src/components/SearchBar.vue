<template> 
  <div class="input-group mb-3">
    <input type="text" placeholder="Search for booths..." v-model="searchQuery"class="form-control"  />
    <button @click="searchBooths" class="btn green-btn"><i class="bi bi-search me-1"></i>Search</button>
  </div>
</template>

<!-- <div class="input-group mb-3">
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
  </button> -->

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      searchQuery: ''
    };
  },
  methods: {
    searchBooths() {
      // Add search functionality logic here
      console.log('Searching for: ', this.searchQuery);
    }
  }
};
</script>
<style src="@/styles/review.css" scoped />
<style scoped>
/* .search-bar {
  background-color: #82c0cc;
  padding: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

input {
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #489fb5;
}

button {
  background-color: #ffa62b;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
} */

button:hover {
  background-color: #e68a19;
}
</style>
