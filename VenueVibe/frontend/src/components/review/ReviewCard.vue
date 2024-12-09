<template>
  <article class="card h-80 w-60 review-card">
    <!-- Image Section -->
    <div class="image-container">
      <img 
        v-if="imageUrl && !imageError" 
        :src="imageUrl" 
        class="review-image" 
        alt="Review Image"
        @error="handleImageError"
        @load="handleImageLoad"
      />
      <div v-else class="no-image">
        <i class="bi bi-image placeholder-icon"></i>
      </div>
    </div>

    <!-- Content Section -->
    <div class="card-body d-flex flex-column">
      <!-- Category -->
      <div class="category">
        <i class="bi bi-shop me-2"></i>
        {{ review.category }}
      </div>

      <!-- Event ID -->
      <h3 class="event-id ">
        {{ review.eventId }}
      </h3>

      <!-- Review Text -->
      <div class="review-content">
        <p class="review-text">
          "{{ review.description }}"
        </p>
      </div>

      <!-- User Info & Rating -->
      <div class="user-section">
        <div class="user-info">
          <!-- User Avatar -->
          <!-- <div class="avatar-wrapper">
            <img 
              src="@/images/img2.png" 
              alt="User avatar"
              class="avatar"
            >
          </div> -->

          <!-- User Details -->
          <div class="user-details">
            <p class="username">{{ review.username }}</p>
            <!-- Rating -->
            <div class="rating">
              <div class="stars">
                <i 
                  v-for="star in 5" 
                  :key="star"
                  class="bi" 
                  :class="star <= review.rating ? 'bi-star-fill' : 'bi-star'"
                ></i>
              </div>
              <span class="rating-text">{{ review.rating }}/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';

const props = defineProps({
  review: {
    type: Object,
    required: true,
    validator: (review) => {
      return review.eventId && 
             review.username && 
             review.category && 
             review.rating && 
             review.description;
    }
  }
});

const emit = defineEmits(['image-error']);

const imageError = ref(false);
const imageUrl = ref(null);

// Function to get image URL from Firebase Storage
const getImageUrl = async () => {
  if (!props.review.imageFile) return null;
  
  try {
    // If the imageFile is already a URL, use it directly
    if (props.review.imageFile.startsWith('http')) {
      return props.review.imageFile;
    }
    
    // Otherwise, get URL from Firebase Storage
    const storage = getStorage();
    const imageRef = storageRef(storage, props.review.imageFile);
    return await getDownloadURL(imageRef);
  } catch (error) {
    console.error('Error getting image URL:', error);
    return null;
  }
};

const handleImageError = () => {
  console.error('Image failed to load:', props.review.imageFile);
  imageError.value = true;
  emit('image-error');
};

const handleImageLoad = () => {
  imageError.value = false;
  console.log('Image loaded successfully');
};

// Load image when component mounts
onMounted(async () => {
  if (props.review.imageFile) {
    imageUrl.value = await getImageUrl();
  }
});
</script>

<style src="@/styles/review.css" scoped />

<style scoped>
/* Card Container */
.review-card {
  transition: all 0.3s ease;
  border: none;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Image Section */
.image-container {
  height: 250px;
  position: relative;
  overflow: hidden;
}

.review-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.review-card:hover .review-image {
  transform: scale(1.05);
}

.no-image {
  height: 100%;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  font-size: 3rem;
  color: #ccc;
}

/* Category */
.category {
  font-size: 0.9rem;
  color: #36b598;
  margin-bottom: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}

/* Event ID */
.event-id {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.3;
}

/* Review Content */
.review-content {
  margin: 1.5rem 0;
}

.review-text {
  font-style: italic;
  color: #555;
  text-align: center;
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
}

/* User Section */
.user-section {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #36b598;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.username {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  margin: 0;
  line-height: 1.2;
}

/* Rating */
.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  color: #ffd700;
  font-size: 0.9rem;
}

.stars i {
  margin-right: 2px;
}

.rating-text {
  color: #666;
  font-size: 0.9rem;
}

/* Loading Animation */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.loading {
  background: linear-gradient(90deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.5) 50%, 
    rgba(255,255,255,0) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .image-container {
    height: 200px;
  }

  .event-id {
    font-size: 1.25rem;
  }

  .review-text {
    font-size: 0.9rem;
  }
}

/* Glass Effect Enhancement */
.card {
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08);
}

.card:hover {
  box-shadow: 
    0 10px 20px rgba(0, 0, 0, 0.1),
    0 4px 6px rgba(0, 0, 0, 0.06);
}


</style>