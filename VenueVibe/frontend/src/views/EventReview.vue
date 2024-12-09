# EventReview.vue
<template>
  <div class="event-review-container heading-montserrat">
    <LoadingOverlay v-if="loading" />
    <!-- Video Background -->
    <video
      class="background-video"
      autoplay
      muted
      loop
      playsinline
    >
      <source src="/videos/market.mp4" type="video/mp4">
    </video>

    <!-- Overlay -->
    <div class="video-overlay"></div>

    
    <!-- Error Alert -->
    <div 
      v-if="error" 
      class="alert alert-danger alert-dismissible fade show m-3" 
      role="alert"
    >
      {{ error }}
      <button 
        type="button" 
        class="btn-close" 
        @click="error = null" 
        aria-label="Close"
      ></button>
    </div>

    <!-- Page Title -->
    <div class="container section-title "  style="margin-bottom:0px; " data-aos="fade-up">
      <h2  style="color:white; ">Event Reviews</h2>
    </div>

    <div class="container">
    <div class="row mb-4 ">
      <ReviewSearch 
        v-model:searchId="searchEventId"
        :loading="loading"
        @search="searchReviews"
      />
      
      <div class="col-md-6">
        <ReviewFormButton 
          :loading="loading"
          @click="openReviewModal"
        />
      </div>
    </div>
  </div>

    <!-- Charts Section -->
     <div class="container">
    <div v-if="searchEventId && filteredReviews.length > 0" class="row">
      <RatingChart 
        :reviews="filteredReviews"
        :event-id="searchEventId"
      />
      <DemographicsChart 
        :reviews="filteredReviews"
        :event-id="searchEventId"
      />
      <span style="margin:20px"></span>
      <RevenueAnalysisChart 
        :reviews="filteredReviews"
        :event-id="searchEventId"
      />
    </div>
    </div>
    <!-- Reviews Section -->
    <section id="reviews" class="reviews-section section">
      <div class="container"  v-if="filteredReviews.length === 0">
        <div class="alert alert-info text-center">
          <i class="bi bi-info-circle me-2"></i>
          No reviews found for this event.
        </div>
      </div>

      <div class="container"  v-else>
        <div class="row gy-4 gx-2">
          <div 
            v-for="(review, index) in filteredReviews" 
            :key="review.id" 
            class="col-xl-4 col-md-6" 
            data-aos="fade-up" 
            :data-aos-delay="100 * (index + 1)"
          >
            <ReviewCard 
              :review="review"
              @image-error="handleImageError"
            />
          </div>
        </div>
      </div>
    </section>

    <ReviewForm 
      ref="reviewFormRef"
      @submit="handleReviewSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useReviews } from '@/composables/useReviews';
import ReviewCard from '@/components/review/ReviewCard.vue';
import ReviewForm from '@/components/review/ReviewForm.vue';
import ReviewSearch from '@/components/review/ReviewSearch.vue';
import ReviewFormButton from '@/components/review/ReviewFormButton.vue';
import RatingChart from '@/components/review/ReviewCharts/RatingChart.vue';
import DemographicsChart from '@/components/review/ReviewCharts/DemographicsChart.vue';
import RevenueAnalysisChart from '@/components/review/ReviewCharts/RevenueAnalysisChart.vue';
// import LoadingOverlay from '@/components/review/LoadingOverlay.vue';

const reviewFormRef = ref(null);
const {
  reviews,
  filteredReviews,
  loading,
  error,
  searchEventId,
  fetchReviews,
  searchReviews,
  submitReview,
  setupRealtimeUpdates
} = useReviews();

const openReviewModal = () => {
  reviewFormRef.value?.openModal();
};

const handleReviewSubmit = async (reviewData) => {
  const success = await submitReview(reviewData);
  if (success) {
    reviewFormRef.value?.closeModal();
  }
};

const handleImageError = (reviewId) => {
  console.error(`Image loading failed for review ${reviewId}`);
  // Optionally show a notification or handle the error
  error.value = 'Failed to load one or more images';
};

let unsubscribe;

onMounted(async () => {
  await fetchReviews();
  unsubscribe = setupRealtimeUpdates();
});

onBeforeUnmount(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});


</script>

<style src="@/styles/review.css" scoped />

<style scoped>
@media (max-width: 768px) {
  
  .section-title h2 {
    font-size: 36px;
  }
}


.event-review-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background-color: transparent; /* Make sure container is transparent */
}

.background-video {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -2;
  object-fit: cover;
}

.video-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: contrast(200%) brightness(100%) saturate(200%) ;
  /* background-color: rgba(51, 31, 4, 0.5);  */
  /* Adjust opacity as needed */
  z-index: -1;
}

/* Add this to make content sections transparent */
.container, 
.section,
.reviews-section,
.row {
  background-color: transparent !important;
}

/* Ensure content is above video but below overlay */
.content-wrapper,
.section-title,
.reviews-section,
#reviews,
.alert,
.row {
  position: relative;
  z-index: 1;
}
</style>