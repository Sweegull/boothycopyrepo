<template>

  <div class="booth-details-container image-container">
    <!-- Main Content Area -->
    <div v-if="booth" class="booth-details-card glass-effect">
      <!-- Image Section -->
      <div class="post-img">
        <img :src="booth.booth_image" alt="Booth Image" class="booth-image" />
      </div>

      <!-- Title and Main Info -->
      <div class="booth-header">
        <h1 class="booth-title heading-montserrat">{{ booth.booth_title }}</h1>
        <div class="booth-highlights">
          <div class="highlight-item">
            <i class="fas fa-dollar-sign"></i>
            <span>${{ booth.price.toFixed(2) }}</span>
          </div>
          <div class="highlight-item">
            <i class="fas fa-clock"></i>
            <span>{{ booth.duration }} Days</span>
          </div>
          <div class="highlight-item">
            <i class="fas fa-store"></i>
            <span>{{ booth.size }} sq. ft.</span>
          </div>
        </div>
      </div>

      <!-- Detailed Information -->
      <div class="booth-info">
        <div class="info-grid">
          <div class="info-item">
            <i class="fas fa-id-badge"></i>
            <div class="info-content" style="overflow:scroll;">
              <label>Booth ID</label>
              <p>{{ booth.booth_id }}</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-calendar-alt"></i>
            <div class="info-content">
              <label>Event ID</label>
              <p>{{ booth.event_id }}</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-user-tie"></i>
            <div class="info-content">
              <label>Organizer</label>
              <p>{{ booth.organizer_id }}</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-check-circle"></i>
            <div class="info-content">
              <label>Status</label>
              <p>{{ booth.availability_status }}</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-calendar-alt"></i>
            <div class="info-content">
              <label>Starts</label>
              <p>{{ formatDate(booth.date_from) }}</p>
            </div>
          </div>
          <div class="info-item">
            <i class="fas fa-calendar-alt"></i>
            <div class="info-content">
              <label>Ends</label>
              <p>{{ formatDate(booth.date_to) }}</p>
            </div>
          </div>
        </div>


        <div class="booth-description">
          <h3 class="description-title">
            <i class="fas fa-info-circle"></i>
            Description
          </h3>
          <p class="description-content">{{ booth.description }}</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="button-group">
        <button @click="openProfileSelection" class="apply-button">
          <i class="fas fa-paper-plane"></i>
          Apply Now
        </button>
        <router-link to="/booths" class="back-link text-decoration-none">
          <button class="back-button">
            <i class="fas fa-arrow-left"></i>
            Back to Listings
          </button>
        </router-link>
      </div>
    </div>

    <!-- Map Section -->
    <div v-if="booth" class="map-container glass-effect">
      <div id="map" class="map"></div>
    </div>

    <!-- Loading State -->
    <div v-else class="loading-state">
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-else class="loading-message">
        <i class="fas fa-spinner fa-spin"></i>
        Loading booth details...
      </p>
    </div>

    <!-- Reuse existing modal and notification components -->
    <ProfileSelectionModal :isOpen="showProfileModal" :profiles="profiles" :boothDetails="booth"
      @close="closeProfileModal" @selectProfile="handleProfileSelection" />

    <div v-if="notification" class="notification-toast" :class="notification.type">
      <i :class="notification.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
      {{ notification.message }}
    </div>
  </div>

</template>


<script>
import { ref, onMounted } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import { boothAPI } from '../services/api';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useRouter } from 'vue-router';
import ProfileSelectionModal from '../components/ProfileSelectionModal.vue';
import dayjs from 'dayjs';

export default {
  name: 'BoothDetails',
  components: {
    ProfileSelectionModal
  },
  props: ['id'],
  setup(props) {
    const booth = ref(null);
    const error = ref(null);
    const showProfileModal = ref(false);
    const profiles = ref([]);
    const auth = getAuth();
    const router = useRouter();
    const notification = ref(null);

    const showNotification = (message, type = 'success') => {
      notification.value = { message, type };
      setTimeout(() => {
        notification.value = null;
      }, 3000);
    };

    const fetchProfiles = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          // If no user is logged in, redirect to login
          router.push('/login');
          return;
        }

        const querySnapshot = await getDocs(
          collection(db, 'application_profiles', user.uid, 'profiles')
        );

        profiles.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (err) {
        console.error('Error fetching profiles:', err);
        showNotification('Error fetching application profiles', 'error');
      }
    };

    const fetchBoothDetails = async () => {
      try {
        const response = await boothAPI.get(`/booths/${props.id}`);
        booth.value = response.data;
        if (booth.value && booth.value.postal_code) {
          loadGoogleMaps();
        }
      } catch (err) {
        error.value = 'Error fetching booth details';
        showNotification('Error fetching booth details', 'error');
      }
    };

    const createApplication = async (profile) => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push('/login');
          return;
        }

        // Create the application document
        await addDoc(collection(db, 'eventApplications'), {
          userId: user.uid,
          boothId: booth.value.booth_id,
          eventId: booth.value.event_id,
          profileId: profile.id,
          eventName: booth.value.booth_title,
          status: 'PENDING',
          date: new Date(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          notes: `Applied using profile: ${profile.name}`,
          profileDetails: {
            name: profile.name,
            focus: profile.focus,
            description: profile.description
          },
          boothDetails: {
            title: booth.value.booth_title,
            price: booth.value.price,
            size: booth.value.size,
            duration: booth.value.duration
          }
        });

        showNotification('Application submitted successfully!', 'success');

        // Redirect to applications page
        setTimeout(() => {
          router.push('/eventapplications');
        }, 1500);
      } catch (err) {
        console.error('Error creating application:', err);
        showNotification('Error creating application', 'error');
      }
    };

    const openProfileSelection = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/login');
        return;
      }
      await fetchProfiles();
      showProfileModal.value = true;
    };

    const closeProfileModal = () => {
      showProfileModal.value = false;
    };

    const handleProfileSelection = async (profile) => {
      await createApplication(profile);
      closeProfileModal();
    };

    const formatDate = (date) => {
      return dayjs(date).format('DD MMMM YYYY');
    }

    const loadGoogleMaps = () => {
      const loader = new Loader({
        apiKey: 'AIzaSyAeSyt0WZgXPM3dw-fB_ryg1Vs0Yq6OFl4',
        version: 'weekly',
      });

      loader.load().then(async () => {
        const { Map } = await google.maps.importLibrary('maps');
        const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

        const map = new Map(document.getElementById('map'), {
          center: { lat: 1.3521, lng: 103.8198 },
          zoom: 15,
          mapId: 'c41954172f2edac5',
        });

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: `${booth.value.postal_code}, Singapore` }, (results, status) => {
          if (status === 'OK' && results[0]) {
            map.setCenter(results[0].geometry.location);
            new AdvancedMarkerElement({
              map: map,
              position: results[0].geometry.location,
            });
          } else {
            console.error('Geocode error:', status);
          }
        });
      }).catch((error) => {
        console.error('Google Maps API load error:', error);
      });
    };

    onMounted(() => {
      fetchBoothDetails();
    });

    return {
      booth,
      error,
      showProfileModal,
      profiles,
      notification,
      formatDate,
      openProfileSelection,
      closeProfileModal,
      handleProfileSelection
    };
  }
};
</script>
<style scoped>
.image-container {
  background-image: url("@/images/img7.jpg");
  background-size: cover;
}

/* Main Layout */
.booth-details-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  padding: 20px;
  gap: 20px;
  margin-top: 64px;
}

/* Card Styling */
.booth-details-card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  width: 100%;
  margin: 0 auto;
}

/* Image Section */
.post-img {
  width: 100%;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}

.booth-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

/* Header Section */
.booth-header {
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.booth-title {
  font-size: 2em;
  margin-bottom: 10px;
  color: #333;
}

/* Highlights Section */
.booth-highlights {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  padding: 15px;
  background: rgba(54, 181, 152, 0.1);
  border-radius: 10px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1em;
  color: #36b598;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.info-item i {
  color: #36b598;
  font-size: 1.2em;
}

.info-content label {
  display: block;
  font-size: 0.9em;
  color: #888;
  margin-bottom: 5px;
}

.info-content p {
  margin: 0;
  font-size: 1.1em;
  color: #333;
}

/* Timestamps */
.timestamps {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.timestamp-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
}

/* Button Group */
.button-group {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.apply-button,
.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.apply-button {
  flex: 2;
  background: #36b598;
  color: white;
}

.apply-button:hover {
  background: #2d9a82;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(54, 181, 152, 0.3);
}

.back-button {
  flex: 1;
  background: rgba(0, 0, 0, 0.1);
  color: #666;
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* Map Section */
.map-container {
  width: 100%;
  height: 600px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 40px;
}

.loading-message,
.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.2em;
}

.error-message {
  color: #f44336;
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification-toast.success {
  background-color: #36b598;
}

.notification-toast.error {
  background-color: #f44336;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Responsive Design */
@media screen and (min-width: 769px) {
  .booth-details-container {
    flex-direction: row;
    align-items: flex-start;
    padding: 40px 20px;
  }

  .booth-details-card,
  .map-container {
    flex: 1;
    margin: 0 10px;
    max-height: 90vh;
    overflow-y: auto;
  }
}

@media screen and (max-width: 768px) {
  .map-container {
    height: 400px;
  }

  .booth-title {
    font-size: 1.5em;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 480px) {
  .booth-details-container {
    padding: 10px;
  }

  .notification-toast {
    left: 20px;
    right: 20px;
    text-align: center;
  }

  .button-group {
    flex-direction: column;
  }

  .apply-button,
  .back-button {
    width: 100%;
  }
}

.booth-description {
  margin-top: 20px;
  padding: 20px;
  background: rgba(54, 181, 152, 0.05);
  border-radius: 10px;
  border-left: 4px solid #36b598;
}

.description-title {
  font-size: 1.2em;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.description-title i {
  color: #36b598;
}

.description-content {
  color: #666;
  line-height: 1.6;
  white-space: pre-wrap;
  margin: 0;
}
</style>
