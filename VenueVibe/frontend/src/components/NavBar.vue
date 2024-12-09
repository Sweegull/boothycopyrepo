<template>
  <nav class="navbar navbar-expand-lg navbar-transparent fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Boothy</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item" v-for="link in loggedOutLinks" :key="link.name" v-if="!isLoggedIn">
            <router-link class="nav-link" :to="link.path">{{ link.name }}</router-link>
          </li>
          <li class="nav-item" v-for="link in loggedInLinks" :key="link.name" v-if="isLoggedIn">
            <router-link class="nav-link" :to="link.path">{{ link.name }}</router-link>
          </li>
          
          <!-- Profile Dropdown -->
          <!-- Profile Dropdown for logged-in users -->
          <li class="nav-item dropdown" v-if="isLoggedIn">
            <a class="nav-link dropdown-toggle" 
               href="#" 
               id="profilesDropdown" 
               role="button" 
               data-bs-toggle="dropdown" 
               aria-expanded="false">
              {{ user.data.displayName || 'Profile' }} <!-- Display user's name or 'Profile' -->
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profilesDropdown">
              <li>
                <router-link class="dropdown-item" to="/profile">
                  User Profile
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/businessprofile">
                  Business Profile
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/applicationprofiles">
                  Application Profiles
                </router-link>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout">Log Out</a>
              </li>
            </ul>
          </li>

          <li class="nav-item" v-if="!isLoggedIn">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { getAuth } from "firebase/auth";
import { mapGetters } from 'vuex';
import { db } from '../firebase'; // Assuming Firebase is set up correctly with modular imports
import { doc, getDoc } from 'firebase/firestore'; // Import specific Firestore methods

export default {
  name: 'NavBar',
  computed: {
    ...mapGetters(['user']), // Access the user getter
    isLoggedIn() {
      return this.user.loggedIn; // Check if the user is logged in
    }
  },
  data() {
    return {
      profileType: null, // Store the profile type here
      loggedOutLinks: [
        { name: 'Home', path: '/' },
        { name: 'Booths', path: '/booths' },
        { name: 'Event Reviews', path: '/eventreviews' },
        { name: 'About', path: '/about' },
      ],
      loggedInLinks: [
        { name: 'Home', path: '/' },
        { name: 'Apply', path: '/eventapplications' },
        { name: 'Booths', path: '/booths' },
        { name: 'Event Reviews', path: '/eventreviews' },
        { name: 'Collaborate', path: '/collaborate' },
        { name: 'About', path: '/about' },
        { name: 'Payments', path: '/payments'}
      ]
    };
  },
  async mounted() {
    const auth = getAuth();
    const currentUser = auth.currentUser; // Get current user from Firebase Auth

    if (currentUser) {
      console.log('User UID:', currentUser.uid); // Log UID before querying Firestore
      await this.fetchProfileType(currentUser.uid); // Fetch profile type using the UID
      this.updateLinksBasedOnProfileType(); // Adjust links after profile is fetched
    } else {
      console.error('No user is logged in');
    }
  },
  methods: {
    async fetchProfileType(uid) {
      try {
        // Fetch the user document from Firestore using the user's UID
        const userDocRef = doc(db, 'user', uid); // Use doc() for fetching user document
        const userDoc = await getDoc(userDocRef); // Fetch the document using getDoc

        if (userDoc.exists()) {
          // Store the profile type in the component's state
          this.profileType = userDoc.data().profile_type;
          console.log('Profile Type:', this.profileType); // Log for debugging
        } else {
          console.error('User not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching profile type:', error);
      }
    },
    updateLinksBasedOnProfileType() {
      if (this.profileType === 'organiser') {
        // Change 'Apply' to 'Applications' and update the path
        const applyLink = this.loggedInLinks.find(link => link.name === 'Apply');
        if (applyLink) {
          applyLink.name = 'Applications';
          applyLink.path = '/applicationreview';
        }
      }
    },
    logout() {
      // Commit Vuex actions to log out the user
      this.$store.commit('SET_LOGGED_IN', false);
      this.$store.commit('SET_USER', null);
      this.$router.push('/'); // Redirect to the home page or login page
    }
  },
};
</script>



<style scoped>
.navbar {
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  position: fixed;
}

.navbar-brand {
  color: rgb(54, 181, 152) !important;
  font-weight: bold;
}

.nav-link {
  color: #000 !important;
  margin-left: 15px;
}

.nav-link:hover, 
.dropdown-item:hover {
  color: #3aafa9 !important;
  font-weight: bold;
}

.dropdown-menu {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.dropdown-item {
  padding: 8px 20px;
  color: #000;
}

@media (max-width: 992px) {
  .nav-link {
    margin-left: 0;
    padding: 10px 15px;
  }
  
  .dropdown-menu {
    border: none;
    box-shadow: none;
    padding-left: 20px;
  }

}
</style>