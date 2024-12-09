<template>
  <div class="image-container">
    <div class="container section-title" data-aos="fade-up">
      <h2>
        <div class="title-with-lines heading-montserrat">
          Booth Listings
        </div>
      </h2>
  
      <AddBoothFormButton 
        v-if="isLoggedIn && isOrganiser"
        :loading="loading"
        @click="openReviewModal"
      />
    </div>
  
    <div class="search-container input-group mb-3">
      
      <input 
        type="text"
        v-model="searchQuery"
        placeholder="Search booths by name..."
        class="search-input form-control"
        style="max-width: 500px;"
      />
      <button @click="searchBooths" class="btn green-btn"><i class="bi bi-search me-1"></i></button>
    </div>
  
    <div>
      <section class="booth-listings">
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">{{ error }}</div>
        <BoothCard 
          v-for="booth in filteredBooths" 
          :key="`booth-${booth.id}`"
          :booth="booth" 
          :images="booth.images"
          class="booth-card"
        />
      </section>
    </div>
  
    <AddBoothForm 
      ref="AddBoothFormRef"
      @submit="handleBoothSubmit"
    />
  </div>
  </template>
  
  <script>
  import BoothCard from '../components/BoothCard.vue';
  import AddBoothForm from '@/components/AddBoothForm.vue';
  import AddBoothFormButton from '@/components/AddBoothFormButton.vue';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '../firebase';
  import { boothAPI } from '../services/api';
  import { mapGetters } from "vuex";
  
  export default {
    name: 'Booth',
    components: {
      BoothCard,
      AddBoothForm,
      AddBoothFormButton,
    },
    computed: {
      ...mapGetters(['user']),
      isLoggedIn() {
        return this.user.loggedIn;
      },
      filteredBooths() {
        if (!this.searchQuery) {
          return this.booths;
        }
        const query = this.searchQuery.toLowerCase().trim();
        return this.booths.filter(booth => {
          // Log each booth for debugging
          console.log('Checking booth:', booth);
          return booth && Object.values(booth).some(value => 
            value && value.toString().toLowerCase().includes(query)
          );
        });
      }
    },
    data() {
      return {
        booths: [],
        loading: true,
        error: null,
        isOrganiser: false,
        AddBoothFormRef: null,
        searchQuery: '', 
      };
    },
    methods: {
      async fetchBooths() {
        try {
          const response = await boothAPI.get('/booths');
          this.booths = response.data;
          console.log('Fetched booths:', this.booths);
        } catch (error) {
          console.error('Error fetching booths:', error);
          this.error = 'Error fetching booths';
        } finally {
          this.loading = false;
        }
      },
      async checkUserProfile() {
        const auth = getAuth();
  
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              const userDoc = await getDoc(doc(db, 'user', user.uid));
  
              if (userDoc.exists()) {
                const userData = userDoc.data();
                this.isOrganiser = userData.profile_type === 'organiser';
              } else {
                console.error('User document not found!');
                this.isOrganiser = false;
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
              this.isOrganiser = false;
            }
          } else {
            this.isOrganiser = false;
            console.log('No authenticated user found');
          }
        });
      },
      openReviewModal() {
        this.$refs.AddBoothFormRef.openModal();
      },
      handleBoothSubmit(reviewData) {
        console.log('Submitted Booth:', reviewData);
        this.$refs.AddBoothFormRef.closeModal();
      }
    },
    async mounted() {
      this.fetchBooths();
      this.checkUserProfile();
    }
  };
  </script>
  
  <style src="@/styles/review.css" scoped />
  
  <style scoped>
  .image-container {
    background-image: url('@/images/marketdark.jpg');
    background-size: cover;
  }
  
  .btn.custom-btn {
    background-color: #36b598;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .btn.custom-btn:hover {
    background-color: #16697a;
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .booth-listings {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
    padding: 20px;
  }
  
  .booth-card {
    transition: all 0.3s ease;
    will-change: transform;
  }
  
  .search-container {
    padding: 20px;
    display: flex;
    justify-content: center;
  }
  
  /* .search-input {
    width: 100%;
    max-width: 500px;
    padding: 12px 20px;
    margin: 8px 0;
    border: 2px solid #36b598;
    border-radius: 25px;
    font-size: 16px;
    background-color: rgba(255, 255, 255, 0.9);
    transition: all 0.3s ease;
  } */
  
  .search-input:focus {
    outline: none;
    border-color: #16697a;
    box-shadow: 0 0 8px rgba(54, 181, 152, 0.4);
  }

  @media (max-width: 768px) {
  
  .section-title h2 {
    font-size: 36px;
  }}
  </style>