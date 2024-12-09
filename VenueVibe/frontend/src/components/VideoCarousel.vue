<template>
  <div class="carousel-container container-fluid">
    <div class="cards-wrapper">
      <div 
        class="carousel-card" 
        v-for="(card, index) in cards" 
        :key="index"
        :class="{ 'd-none d-xl-flex': index !== currentCardIndex }"
      >
        <h3 class="carousel-title">{{ card.title }}</h3>
        
        <!-- Video Section -->
        <div class="carousel-video-container container-fluid">
          <video
            class="carousel-video"
            autoplay
            muted
            loop
            playsinline
          >
            <source :src="card.videoSrc" type="video/mp4">
          </video>
        </div>

        <!-- Description Section -->
        <div class="carousel-description heading-montserrat">
          {{ card.description }}
        </div>
        <div class="video-source heading-montserrat">
          {{ card.source }}
        </div>
        <div class="video-link">
          <a :href="card.link" target="_blank" rel="noopener noreferrer" class="tiktok-link">
            <i class="fab fa-tiktok"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons for MD/LG -->
    <div class="navigation-buttons d-md-flex d-xl-none">
      <button 
        class="btn green-btn me-2" 
        @click="previousCard" 
        :disabled="currentCardIndex === 0"
      >
        Previous
      </button>
      <button 
        class="btn green-btn" 
        @click="nextCard" 
        :disabled="currentCardIndex === cards.length - 1"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const cards = [
  {
    title: 'Public Garden',
    videoSrc: '/videos/Tiktok1.mp4',
    description: 'Recurring artisan trade show | Suntec Singapore Convention Centre',
    source:' Creds: @halfacoffee. ',
    link:'https://www.tiktok.com/@halfacoffee/video/7419647197534244104?is_from_webapp=1&sender_device=pc&web_id=7393597550110246401'

  },
  {
    title: 'Resurrack Vintage Market',
    videoSrc: '/videos/Tiktok2.mp4',
    description: 'Every Weekend | Bugis Street Art Lane',
    source:' Creds: @hiddenjemmm. ',
    link:'https://www.tiktok.com/@hiddenjemmm/video/7432680759858613511?is_from_webapp=1&sender_device=pc&web_id=7393597550110246401'

  },
  {
    title: 'Night at Orchard',
    videoSrc: '/videos/Tiktok3.mp4',
    description: 'Monthly night market | Orchard Road',
    source:' Creds: @kai.icloud. ',
    link:'https://www.tiktok.com/@kai.icloud/video/7385611305631223047?is_from_webapp=1&sender_device=pc&web_id=7393597550110246401'

  },
  {
    title: 'Makers Market',
    videoSrc: '/videos/Tiktok4.mp4',
    description: 'INVADE Pop-up Markets | Islandwide',
    source:' Creds: @invade.co. ',
    link:'https://www.tiktok.com/@invade.co/video/7276691282121051393?is_from_webapp=1&sender_device=pc&web_id=7393597550110246401'
  }
];

const currentCardIndex = ref(0);

const nextCard = () => {
  if (currentCardIndex.value < cards.length - 1) {
    currentCardIndex.value++;
  }
};

const previousCard = () => {
  if (currentCardIndex.value > 0) {
    currentCardIndex.value--;
  }
};
</script>
<style src="@/styles/review.css" scoped />

<style scoped>
/* Import Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.carousel-container {
  margin: auto;
  padding: 0px;
  perspective: 1000px;
}

.cards-wrapper {
  display: flex;
  justify-content: center;
  gap: -50px;
}

.carousel-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  box-shadow: -1rem 0 3rem rgba(0, 0, 0, 0.3);
  transition: 0.4s ease-out;
  position: relative;
  padding: 20px;
  /* Add minimum height to ensure content fits */
  min-height: 400px;
  /* Add padding bottom to make room for buttons */
  padding-bottom: 40px; /* Increase this value if buttons still get cut */
}


/* XL screens and up - Show overlapping cards */
@media (min-width: 1200px) {
  .carousel-card {
    margin-left: -45px;
  }

  .carousel-card:first-child {
    margin-left: 0;
  }

  .carousel-card:hover {
    transform: translateY(-20px);
  }

  .carousel-card:hover ~ .carousel-card {
    position: relative;
    left: 50px;
    transition: 0.4s ease-out;
  }
}

/* MD and LG screens - Single card view */
@media (max-width: 1199px) {
  .cards-wrapper {
    gap: 0;
  }

  .carousel-card {
    margin-left: 0;
    width: 100%;
    max-width: 500px;
    max-height: 500px;
  }
}

/* SM screens and down */
@media (max-width: 767px) {
  .cards-wrapper {
    flex-direction: column;
    align-items: center;
  }
  
  .carousel-card {
    max-width: 300px;
  }
}

.carousel-video-container {
  opacity: 1;
  overflow: hidden;
  padding-bottom: 15px;
  margin: 15px 0;
}

.carousel-video {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

.carousel-title {
  color: #333;
  height:40px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: 'Montserrat', sans-serif;
}

.carousel-description {
  color: #36b598;
  font-weight: bold;
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 15px;
}

.navigation-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.video-source{
  font-size:0.7rem;
  color:#333;
}

.tiktok-link {
  color: #000;
  font-size: 3rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.tiktok-link:hover {
  transform: scale(1.1);
  color: #36b598; /* TikTok's cyan color */
}

/* Optional: Add a cool hover effect */
.tiktok-link i {
  transition: all 0.3s ease;
}

.tiktok-link:hover i {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(10deg); }
  75% { transform: rotate(-10deg); }
}
</style>