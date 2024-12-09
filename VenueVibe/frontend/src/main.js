// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';


// Bootstrap imports
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Font Awesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import Font Awesome CSS
import '@fortawesome/fontawesome-svg-core/styles.css';
import AOS from 'aos';
import 'aos/dist/aos.css';


// Check if the environment variable is available
if (!process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY) {
  console.error('Missing Stripe publishable key in environment variables')
}


// Initialize AOS ( for animation )
AOS.init({
    // Global settings:
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });

// Add icons to the library
library.add(fas, far, fab);

// Create app
const app = createApp(App);

// Use router
app.use(router);

// Register the Vuex store
app.use(store);

// Register Font Awesome component globally
// You can use either 'fa' or 'font-awesome-icon' as the component name
app.component('fa', FontAwesomeIcon);
app.component('font-awesome-icon', FontAwesomeIcon); // Optional: register with full name too

// Mount app
app.mount('#app');

window.store = store;