<template>
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/VenueVibe/frontend/public/favicon.ico" />
    <title>Boothy</title>
  </head>
  <div id="app">
    <header></header>

    <NavBar :key="navbarKey" />

    <main class="main-content">
      <router-view />
      <!-- Chat Icon Button -->
      <div v-if="isLoggedIn && showChatIcon" class="chat-icon">
      <router-link to="/CollaborateChat">
        <fa :icon="['fas', 'comment-dots']" style="color: #ffffff;"></fa>
      </router-link>
    </div>
    </main>
    <!-- SORRY I HAVENT ADD ALL THE LINKS -->
    <footer id="footer" class="footer">
      <div class="container footer-top">
        <div class="row gy-4">
          <div class="col-lg-4 col-md-6 footer-about">
            <h5 class="display-6 fw-bold" style="font-weight: 600">Boothy</h5>
            <div class="footer-contact pt-3">
              <p>81 Victoria St</p>
              <p>Singapore, S188065</p>
              <p class="mt-3">
                <strong>Phone:</strong> <span>+1 5589 55488 55</span>
              </p>
              <p>
                <strong>Email:</strong>
                <span>ritz.chong.2022@scis.smu.edu.sg</span>
              </p>
            </div>
            <div class="social-links d-flex mt-4">
              <a href="https://twitter.com/sgSMU"
                ><i class="bi bi-twitter-x"></i
              ></a>
              <a href="https://www.facebook.com/timothy.swee?mibextid=LQQJ4d"
                ><i class="bi bi-facebook"></i
              ></a>
              <a href="https://www.instagram.com/thisisisisshop/"
                ><i class="bi bi-instagram"></i
              ></a>
              <a href="https://www.linkedin.com/in/tasminfoo/"
                ><i class="bi bi-linkedin"></i
              ></a>
            </div>
          </div>

          <div class="col-lg-4 col-md-6 footer-links">
            <h5>Useful Links</h5>
            <ul>
              <li>
                <router-link to="/" class="text-decoration-none text-white"
                  >Home</router-link
                >
              </li>
              <li>
                <router-link
                  to="/booths"
                  class="text-decoration-none text-white"
                  >Booth Listings</router-link
                >
              </li>
              <li>
                <router-link
                  to="/eventreviews"
                  class="text-decoration-none text-white"
                  >Event Reviews</router-link
                >
              </li>
              <li>
                <router-link
                  to="/about"
                  class="text-decoration-none text-white"
                  >About</router-link
                >
              </li>
            </ul>
          </div>

          <!-- <div class="col-lg-2 col-md-3 footer-links">
      <h5>Our Services</h5>
      <ul>
        <li><a href="#" class="text-decoration-none text-white">Web Design</a></li>
        <li><a href="#" class="text-decoration-none text-white">Web Development</a></li>
        <li><a href="#" class="text-decoration-none text-white">Product Management</a></li>
        <li><a href="#" class="text-decoration-none text-white">Marketing</a></li>
        <li><a href="#" class="text-decoration-none text-white">Graphic Design</a></li>
      </ul>
    </div> -->

          <div class="col-lg-4 col-md-12 footer-newsletter">
            <h5>Our Newsletter</h5>
            <p>
              Subscribe to our newsletter and receive the latest news about our
              products and services!
            </p>
            <form
              action="forms/newsletter.php"
              method="post"
              class="php-email-form"
            >
              <div class="input-group">
                <input class='form-control'type="email" name="email" 
                style="height:50px;"/>
              
                <input
                  type="submit"
                  value="Subscribe"
                  class="btn green-btn fw-bold"
                />
              </div>
              <!-- <div class="loading">Loading</div>
        <div class="error-message"></div>
        <div class="sent-message">Your subscription request has been sent. Thank you!</div> -->
            </form>
          </div>
          <p style="text-align: center">© 2024 Boothy</p>
        </div>
      </div>
    </footer>

    <!-- Scroll Top -->
    <!-- <a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a> -->

    <!-- Preloader -->
    <div id="preloader"></div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      navbarKey: 0,  // Initial key value
    };
  },
  watch: {
    $route(to, from) {
      // Whenever the route changes, change the key to force re-mounting the NavBar
      this.navbarKey += 1;
    }
  },
  components: {
    NavBar,
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    showChatIcon() {
      // Specify routes where the chat icon should be hidden
      const hideOnRoutes = ['CollaborateChat']; 
      return !hideOnRoutes.includes(this.$route.name);

    }
  },

};
</script>
<style src="@/styles/review.css" scoped />


<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Alkatra:wght@400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
* {
  font-family: "Poppins", sans-serif;
  box-sizing: border-box;
}

.header {
  background-color: #16697a;
  color: white;
  padding: 15px 30px;
  font-size: 18px;
}
.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* padding: 30px; */
  max-width: 100%;
  margin: 0 auto;
  font-family: "Roboto", sans-serif;
  padding-top: 80px; /* Adjust this based on your nav bar height */
}
.footer {
  position: relative; /* Ensure footer is positioned relative to the main content */
  z-index: 10; /* Make sure it appears above the main content */
  color: white;
  background-color: black;
  padding: 50px 0; /* Changed to vertical padding only */
  width: 100%;
  height: auto; /* Let content determine height */
  min-height: 200px;
}

.footer h5 {
  color: beige;
  /* margin-bottom: 10px; */
  font-weight: 700;
}

.social-links a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px; /* Adjust size as needed */
  height: 40px; /* Adjust size as needed */
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-links a:hover {
  border-color: white;
  background: rgba(255, 255, 255, 0.1);
}

.social-links i {
  font-size: 18px; /* Adjust icon size as needed */
}

.chat-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgb(54, 181, 152); /* Change to your preferred color */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 1000; /* Ensure it appears on top of other elements */
  font-size: 25px;
}



/* .footer .social-media {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.footer .social-media i {
  font-size: 24px;
  color: white;
  transition: color 0.3s;
}

.footer .social-media i:hover {
  color: #ff7f50;
} */
</style>
