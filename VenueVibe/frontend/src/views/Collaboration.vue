<script setup>
import { db } from "../firebase.js";

import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";

import { mapGetters } from "vuex";

defineElement(lottie.loadAnimation);
</script>

<template>
  <main>
    <div class="container-fluid px-0 mx-0" v-if="collab">
      <div v-if="loading">
        <p>Loading users...</p>
      </div>
      <div
        v-else
        class="row banner mx-0"
        :style="{ background: `url(${currentSlide.collab_background})` }"
      >
        <!-- <router-link :to="{ name: 'CollaborateChat' }" class="btn mychatbtn">
          <span>My chats</span>
        </router-link> -->
        <!-- Left Column: Content -->
        <div class="col-lg-6 content-wrapper">
          <div class="content active">
            <ul id="links">
              <li>
                <a target="_blank" :href="`${currentSlide.instagram_link}`">
                  <fa :icon="['fab', 'instagram']"></fa>
                </a>
              </li>
              <li>
                <a target="_blank" :href="`${currentSlide.website_link}`">
                  <fa :icon="['fas', 'globe']"></fa>
                </a>
              </li>
              <li>
                <a target="_blank" :href="`${currentSlide.portforlio_link}`">
                  <fa :icon="['fas', 'hashtag']"></fa>
                </a>
              </li>
            </ul>
            <h4>
              <span>{{ currentSlide.profile_type }}</span>
              <span>{{
                currentSlide.interests
                  ? currentSlide.interests.join(", ")
                  : "interest not available"
              }}</span>
            </h4>
            <h1 class="business-name">{{ currentSlide.business_name }}</h1>
            <p>{{ currentSlide.bio || "No bio yet" }}</p>
            <div class="buttons">
              <router-link
                :to="{
                  name: 'CollaborateChat',
                  params: { id: `${currentSlide.id}` },
                }"
                class="btn btn-outline-secondary"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/qnpnzlkk.json"
                  trigger="hover"
                  colors="primary:#e4e4e4"
                  style="width: 18px; height: 18px"
                ></lord-icon>
                Connect & Chat
              </router-link>
              <a
                @click.prevent="bookmarkUser"
                class="btn btn-outline-secondary"
                :disabled="isBookmarked"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/jkzgajyr.json"
                  trigger="hover"
                  colors="primary:#e4e4e4"
                  style="width: 18px; height: 18px"
                ></lord-icon>
                {{ isBookmarked ? "Bookmarked" : "Bookmark" }}
              </a>
            </div>
          </div>
        </div>
        <!-- Right Column: Carousel Box -->
        <div class="col-lg-6 col-md-12 carousel-box">
          <div
            v-for="(user, index) in rotatedUsers"
            :key="user.id"
            class="carousel"
            :class="{
              active: index === currentIndex,
              'slide-left': slideDirection === 'left',
              'slide-right': slideDirection === 'right',
            }"
            @click="goToSlide(index)"
          >
            <div class="carousel-item">
              <img :src="user.profile_image" />
            </div>
          </div>
        </div>
        <div class="carousel-buttons col-lg-6 align-items-center">
          <button @click="prevUser" class="carousel-control prev"><</button>
          <button @click="nextUser" class="carousel-control next">></button>
        </div>
      </div>
    </div>
    <div v-else>
      <!-- <div class="container-content"> -->
      <section class="header-section d-flex align-items-center">
        <div class="container text-center">
          <div class="row justify-content-center">
            <div class="col-md-6">
              <img
                src="https://i.pinimg.com/originals/ac/e9/14/ace9144fefcf5b9bafd87b7b66e2b627.gif"
                class="header-image"
              />
            </div>
            <div
              class="col-md-6 text-left"
              style="margin-top: auto; margin-bottom: auto"
            >
              <h1>Find Your Next</h1>
              <h1><span>BOOTHY </span>partner !</h1>
              <p>And take your boothing experience to the next level</p>
              <div class="mt-4">
                <button @click="updatecollab" class="btn btn-dark">
                  Get started today
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="timeline-section py-5">
        <div class="container">
          <div class="row position-relative justify-content-center">
            <p>How does it work?</p>
            <!-- Background Line (full-width) -->
            <div class="timeline-background-line"></div>

            <!-- Step 1 -->
            <div
              class="col-12 col-md-6 col-lg-3 text-center timeline-step mb-4"
            >
              <div class="img-wrapper">
                <img
                  src="https://i.pinimg.com/originals/75/97/90/7597905e7bdd5703d4f694d8518fee08.gif"
                  alt="Step 1"
                  class="step-image mb-3"
                />
              </div>
              <div class="timeline-dot"></div>
              <!-- Dot on the line for Step 1 -->
              <h5 class="mt-3">01</h5>
              <p class="step-description">
                Look through our curated list of creators to find your perfect
                partner
              </p>
            </div>

            <!-- Step 2 -->
            <div
              class="col-12 col-md-6 col-lg-3 text-center timeline-step mb-4"
            >
              <div class="img-wrapper">
                <img
                  src="../images/step2.gif"
                  alt="Step 2"
                  class="step-image mb-3"
                  style="transform: scale(1.2)"
                />
              </div>
              <div class="timeline-dot"></div>
              <!-- Dot on the line for Step 2 -->
              <h5 class="mt-3">02</h5>
              <p class="step-description">
                Connect & Chat with the creator you want!
              </p>
            </div>

            <!-- Step 3 -->
            <div
              class="col-12 col-md-6 col-lg-3 text-center timeline-step mb-4"
            >
              <div class="img-wrapper">
                <img
                  src="https://i.pinimg.com/originals/ae/54/e4/ae54e4030cb392129805bc968f57792b.gif"
                  alt="Step 3"
                  class="step-image mb-3"
                />
              </div>
              <div class="timeline-dot"></div>
              <!-- Dot on the line for Step 3 -->
              <h5 class="mt-3">03</h5>
              <p class="step-description">Plan your next booth together!</p>
            </div>

            <!-- Step 4 -->
            <div
              class="col-12 col-md-6 col-lg-3 text-center timeline-step mb-4"
            >
              <div class="img-wrapper">
                <img
                  src="../images/step4.gif"
                  alt="Step 4"
                  class="step-image mb-3"
                  style="transform: scale(1.2); margin-bottom: 0"
                />
              </div>
              <div class="timeline-dot"></div>
              <!-- Dot on the line for Step 4 -->
              <h5 class="mt-3">04</h5>
              <p class="step-description">Set up your booth</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
export default {
  data() {
    return {
      users: [], // Array to hold users and their business profiles
      currentIndex: 0, // Tracks the current user being displayed
      loading: true, // Loading state to display while data is being fetched
      error: null, // Error message in case something goes wrong
      isSliding: false,
      slideDirection: "",
      collab: false,
      isBookmarked: false,
    };
  },
  computed: {
    ...mapGetters(["user", "isLoggedIn", "userId"]),
    currentSlide() {
      // Dynamically get the user data at currentIndex
      return this.users[this.currentIndex] || {};
    },
    // Dynamically reorder the users based on the current index for thumbnails
    rotatedUsers() {
      if (!this.users.length) return [];

      // Rotate the users array so that the currentIndex appears first
      return [
        ...this.users.slice(this.currentIndex),
        ...this.users.slice(0, this.currentIndex),
      ];
    },
    
  },
  methods: {
    async fetchUserCollabStatus() {
      try {
        // Reference to the current user's document
        const userDocRef = doc(db, "user", this.userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          this.collab = userData.collab || false; // Set collab status, defaulting to false if undefined
        } else {
          console.error("User document not found in Firestore.");
        }
      } catch (error) {
        console.error("Error fetching user collab status:", error);
      } finally {
        this.loading = false; // Set loading to false once operation is complete
      }
    },
    async fetchUsers() {
      try {
        this.users = [];
        // Create a query that only fetches users with collab set to true
        const userQuery = query(
          collection(db, "user"),
          where("collab", "==", true)
        );

        // Fetch users that match the query
        const userListing = await getDocs(userQuery);

        // Process each user document
        userListing.forEach((doc) => {
          if (doc.id !== this.userId) {
            // Exclude the current user
            const userData = { ...doc.data(), id: doc.id };
            this.users.push(userData);
          }
        });
      } catch (err) {
        console.error("Error fetching users:", err); // Log error
        this.error = "Failed to load user data."; // Set user-friendly error message
      } finally {
        this.loading = false; // Stop loading once all operations are complete
      }
    },

    // Navigate to the next user
    nextUser() {
      this.slideDirection = "left"; // Set direction to left for next
      this.triggerSlideAnimation(); // Trigger animation before changing the index
      setTimeout(() => {
        this.currentIndex = (this.currentIndex + 1) % this.users.length;
        this.resetSlideAnimation();
      }, 300); // Delay to allow the animation to complete (matches CSS transition time)
    },

    // Navigate to the previous user
    prevUser() {
      this.slideDirection = "right"; // Set direction to right for prev
      if (this.users.length > 0) {
        this.triggerSlideAnimation(); // Trigger animation before changing the index
        setTimeout(() => {
          this.currentIndex =
            (this.currentIndex - 1 + this.users.length) % this.users.length;
          this.resetSlideAnimation();
        }, 300); // Delay to allow the animation to complete (matches CSS transition time)
      }
    },
    goToSlide(index) {
      if (index !== this.currentIndex) {
        this.slideDirection = index > this.currentIndex ? "left" : "right";
        this.triggerSlideAnimation();
        setTimeout(() => {
          // Reorder the array so the clicked user is at the front

          const usersAfterClicked = this.users.slice(index);
          // Extract the part of the array from the beginning to the clicked user
          const usersBeforeClicked = this.users.slice(0, index);
          // Reorder the array: clicked user and following users, then previous users
          this.users = [...usersAfterClicked, ...usersBeforeClicked];
          // Set `currentIndex` to 0 as the clicked user is now at the front
          this.currentIndex = 0;
          this.resetSlideAnimation();
        }, 300); // Delay to allow animation before changing the index
      }
    },
    triggerSlideAnimation() {
      this.isSliding = true;
    },
    resetSlideAnimation() {
      this.isSliding = false;
      this.slideDirection = "";
    },
    async updatecollab() {
  try {
    if (this.isLoggedIn && this.userId) {
      console.log("Updating collaboration status for user:", this.userId);
      const userRef = doc(db, "user", this.userId);

      // Update the 'collab' field in Firestore
      await updateDoc(userRef, {
        collab: true, // Set collab to true or any value you'd like
      });
      console.log("Collab field updated successfully!");
      alert("You have successfully started collaborating!");
      this.fetchUserCollabStatus();
      this.fetchUsers();
    } else {
      console.error("No user is currently signed in or userId is missing.");
      alert("Please sign in to start collaborating.");
    }
  } catch (error) {
    console.error("Error updating collab field:", error);
  }
},
    async bookmarkUser() {
      if (this.isBookmarked) return;
      if (!this.userId || !this.users[this.currentIndex].id) {
        console.error("User ID or slide ID is missing");
        return;
      }

      try {
        // Create a new document in the "bookmarks" collection
        await addDoc(collection(db, "bookmark"), {
          userId: this.userId,
          bookmarkedUserId: this.users[this.currentIndex].id,
          timestamp: new Date(),
        });
        this.isBookmarked = true;
        alert("User bookmarked successfully!");
      } catch (error) {
        console.error("Error bookmarking user:", error);
      }
    },
    async checkIfBookmarked() {
      try {
        // Reset isBookmarked to false when checking a new slide
        this.isBookmarked = false;

        // Query Firestore to see if the current user has already bookmarked the current slide
        const bookmarkQuery = query(
          collection(db, "bookmark"),
          where("userId", "==", this.userId),
          where("bookmarkedUserId", "==", this.users[this.currentIndex].id)
        );

        const querySnapshot = await getDocs(bookmarkQuery);

        // If a document exists, set isBookmarked to true
        if (!querySnapshot.empty) {
          this.isBookmarked = true;
          console.log(this.isBookmarked);
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    },
  },

  mounted() {
    if (this.isLoggedIn) {
      console.log("Logged-in User ID:", this.userId);
      this.fetchUserCollabStatus();
      // Fetch users and their business profiles when the component is mounted
      this.fetchUsers();
    }
  },
  watch: {
    currentSlide: {
      immediate: true, // Run the watcher immediately on component load
      handler(newSlide) {
        if (newSlide && newSlide.id) {
          this.checkIfBookmarked(); // Check if bookmarked when currentSlide changes
        }
      },
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Alkatra:wght@400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
* {
  font-family: "Poppins", sans-serif;
  box-sizing: border-box;
}

.banner {
  position: relative;
  width: 100vw;
  min-height: 95vh;
  padding: 0 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-repeat: no-repeat !important;
  background-size: cover !important;
  background-position: center !important;
  overflow: hidden;
  transition: 0.5s;
}

.banner::before {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.content {
  position: relative;
  max-width: 550px;
  min-width: 500px;
  display: none;
  visibility: hidden;
  transform: scale(0);
  transition: 0.5s;
}

.content.active {
  display: block;
  visibility: visible;
  transform: scale(1);
  transition: 0.5s;
}

/* Content Wrapper */
.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 100%;
}

.banner .content h1 {
  font-weight: 700;
  text-transform: uppercase;
  color: white;
}

.banner .content h4 {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
  font-size: 20px;
}

.banner .content h4 span {
  padding: 0 10px;
  border-right: 1px solid rgba(255, 255, 255, 0.5);
}

.banner .content h4 span:first-child {
  padding-left: 0;
}
.banner .content h4 span:last-child {
  border-right: none;
}

.banner .content p {
  font-size: 1em;
  font-weight: 300;
  line-height: 1.5em;
  color: white;
  margin: 10px 0 20px;
}

.banner .content .buttons {
  position: relative;
}

.banner .content .buttons a {
  position: relative;
  display: inline-block;
  margin-right: 10px;
  color: white;
  background: rgba(255, 255, 255, 0.5);
  padding: 8px 20px;
  text-decoration: none;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: 0.5s;
  cursor: pointer;
}

.banner .content .buttons a:nth-child(2) {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.banner .content .buttons a:hover:nth-child(2) {
  background: rgba(255, 255, 255, 0.5);
}
.banner .content ul#links li {
  list-style-type: none;
  display: inline;
  padding-right: 20px;
  font-size: 20px;
}
.banner .content ul#links li a {
  color: white;
  transition: 0.3s;
}

.banner .content .buttons .btn[disabled] {
  background: rgba(0, 0, 0, 0.5); /* Default background for disabled */
  color: white;
}
.banner .content .buttons .btn[disabled]:hover {
  background: rgba(0, 0, 0, 0.5); /* Darker background on hover when disabled */
  color: #ddd; /* Optional: lightened text color */
}


.mychatbtn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.6);
  width: fit-content;
  padding: 10px 30px;
  color: white;
  text-transform: uppercase;
  transition: 0.5s;
  cursor: pointer;
}

.mychatbtn:hover {
  background: rgba(255, 255, 255, 0.6);
}

.carousel-buttons {
  position: absolute;
  top: 80%;
  left: 10%;
  width: 300px;
  max-width: 30%;
  display: flex;
  gap: 10px;
  align-items: center;
}

.carousel-buttons button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #eee4;
  border: none;
  color: white;
  font-size: large;
  cursor: pointer;
}
.carousel-buttons button:hover {
  background-color: white;
  color: #555;
}

.carousel-control:first-child {
  margin-right: 15px;
}

.banner .carousel-box {
  position: relative;
  min-width: 70vh;
  display: flex;
  justify-content: start;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
  border-radius: 10px;
  max-width: 80vw; /* Limit the maximum width of the carousel box */
  overflow-x: auto; /* Enable horizontal scrolling if there are too many thumbnails */
  overflow-y: hidden;
}

.carousel-box .carousel-item {
  width: 250px;
  cursor: pointer;
  display: flex;
  text-align: center;
}
.carousel-box .carousel-item img {
  max-height: 25vh;
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
  object-position: center;
  padding: 5px;
}
/* Sliding effect to the left */
.slide-left {
  animation: slide-to-start 0.3s forwards;
}

/* Sliding effect to the right */
.slide-right {
  animation: slide-to-end 0.3s forwards;
}

/* Keyframes for sliding left */
@keyframes slide-to-start {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

/* Keyframes for sliding right */
@keyframes slide-to-end {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
/* Remove excessive space on medium screens */
@media (max-width: 1600px) {
  .content-wrapper {
    flex-direction: column;
  }

  .banner .carousel-box {
    position: absolute;
    bottom: 18%;
  }
  .carousel-buttons {
    bottom: 5%;
  }

  .banner .content p {
    max-height: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
  }

  .carousel-box .carousel-item img {
    max-height: 20vh; /* Further reduce max-height for mobile */
  }

  .banner .content {
    margin-bottom: 20%;
  }
}

@media (max-width: 1200px) {
  .banner .content p {
    max-height: 50px; /* Set a fixed height for the paragraph */
    overflow-y: auto;
    text-overflow: ellipsis; /* Optional: show "..." at the end if there's more text */
    white-space: normal; /* Allows the text to wrap onto multiple lines */
  }
}

.container-content {
  width: 100vw;
  min-height: 95vh;
}

/* Hero section styling */
.header-section {
  background-color: #e9e9e0;
  min-height: 55vh;
}

.header-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-section h1 {
  font-size: 4rem;
  font-weight: bold;
}

.header-section span {
  color: rgb(54, 181, 152);
}

.header-section p {
  font-size: 1.25rem;
  margin-top: 1rem;
}

.timeline-section {
  background-color: white;
  text-align: center;
  min-height: 30vh;
  position: relative;
}
.timeline-background-line {
  position: absolute;
  top: 55%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3d3d3d;
  z-index: 1;
  transform: translateY(-50%);
}

/* Dot on the timeline line for each step */
.timeline-dot {
  width: 12px;
  height: 12px;
  background-color: #3d3d3d;
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  top: -5px; /* Adjust to position dot on the line */
  z-index: 2;
}

/* Step image styling */
.step-image {
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
  z-index: 3;
  position: relative;
  object-fit: contain;
}

.img-wrapper {
  width: 150px;
  height: 150px;
  display: inline-block;
}

.timeline-step h5 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #3d3d3d;
  padding-top: 20px;
  margin: 0;
  position: relative;
  z-index: 3;
}

.step-description {
  font-size: 1rem;
  color: #3d3d3d;
  z-index: 3;
  position: relative;
}

@media (min-width: 992px) and (max-width: 1400px) {
  /* Show line only on lg and up */
  .timeline-dot {
    top: 8px; /* Adjust to position dot on the line */
  }
  .header-section h1 {
    font-size: 3rem;
  }
  .header-section p {
    font-size: 1rem;
  }
}
@media (min-width: 768px) and (max-width: 992px) {
  .header-section h1 {
    font-size: 2rem;
  }
  .header-section p {
    font-size: 1rem;
  }
  .timeline-dot {
    width: 10px;
    height: 10px;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .timeline-background-line {
    left: 96.4%;
    top: 0;
    bottom: 20;
    width: 2px;
    height: 95%; /* Ensures the line spans the full container height */
    background-color: #3d3d3d;
    position: absolute;
    transform: translateX(-50%);
    padding: 0;
  }

  .timeline-dot {
    width: 10px;
    height: 10px;
    top: auto;
    left: 50%;
    transform: translateX(-50%);
  }
  .header-section h1 {
    font-size: 2rem;
  }
  .header-section p {
    font-size: 1rem;
  }
  .banner {
    padding: 10px; /* Reduce padding on smaller screens */
  }
  .banner .content p {
    max-width: 400px;
  }
  .content {
    overflow-wrap: break-word; /* Break long words if needed */
    word-wrap: break-word;
    hyphens: auto; /* Automatically hyphenate if a word is too long */
  }
  .banner .content .buttons a {
    padding: 5px 15px; /* Smaller padding */
    font-size: 14px;   /* Smaller font size */
    margin-right: 5px; /* Less margin between buttons */
  }
}
</style>
