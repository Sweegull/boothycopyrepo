<template>
  <div :class="['container', { 'sign-up-mode': isSignUpMode }]">
    <div class="forms-container">
      <div class="signin-signup">
        <!-- Sign-In Form -->
        <form @submit.prevent="signIn" class="sign-in-form">
          <h2 class="title">Sign in</h2>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input type="text" v-model="signInEmail" placeholder="Email" />
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input type="password" v-model="signInPassword" placeholder="Password" />
          </div>
          <button type="button" @click="signIn" value="Login" class="btn solid green-btn">Log In</button>
        </form>

        <!-- Sign-Up Form -->
        <form @submit.prevent="signIn" class="sign-up-form">
          <h2 class="title">Sign up</h2>

          <div class="input-field">
            <i class="fas fa-envelope"></i>
            <input type="text" v-model="email" placeholder="Email" />
          </div>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input type="text" v-model="username" placeholder="Username" />
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input type="password" v-model="password" placeholder="Password" />
          </div>
          <button type="button" @click="register" class="btn">Sign Up</button>
        </form>
      </div>
    </div>

    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>New here?</h3>
          <p>
            Join us as a Boother or an Organiser <br>
            Start your Journey Here!
          </p>
          <button class="btn transparent" @click="toggleMode">Sign up</button>
        </div>
        <img src="../images/booth.png" class="image" alt="Log image" />
      </div>
      <div class="panel right-panel">
        <div class="content">
          <h3>Have an Account?</h3>
          <p></p>
          <button class="btn transparent" @click="toggleMode">Sign in</button>
        </div>
        <img src="../images/booth3.webp" class="image" alt="Register image" />
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref } from 'vue'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'vue-router'; // Import the Vue router
import { useStore } from 'vuex'; // Import Vuex store
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { db } from "../firebase.js";

// Initialize reactive variables for form inputs
const email = ref('');
const username = ref('')
const password = ref('');
const signInEmail = ref('');
const signInPassword = ref('');

// Get a reference to the Vue router
const router = useRouter();

// Get Firebase Auth instance
const auth = getAuth(); // Initialize Firebase Auth

// Access the Vuex store
const store = useStore(); // Access Vuex store to commit mutations

// Function to handle error messages
const handleError = (error) => {
  const errorMessages = {
    'auth/invalid-email': 'The email address is not valid.',
    'auth/user-disabled': 'The user corresponding to the email address has been disabled.',
    'auth/user-not-found': 'No user found corresponding to the email address.',
    'auth/wrong-password': 'The password is invalid or the user does not have a password.',
    'auth/email-already-in-use': 'The email address is already in use by another account.',
    'auth/weak-password': 'The password is too weak. It should be at least 6 characters long.',
  };
  return errorMessages[error.code] || 'An unknown error occurred. Please try again.';
}

// Register function
const register = async () => {
  try {
    // Use createUserWithEmailAndPassword method to register a new user
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    console.log('Successfully registered!', user);

    // Create a Firestore document with just the user's UID as the doc ID (no fields yet)
    await setDoc(doc(db, "user", user.uid), {
      email: user.email, // Save the user's email in the Firestore document
      username: username.value,
      collab: false
    });

    // Update Vuex store: Set user data and loggedIn status
    store.commit('SET_LOGGED_IN', true);
    store.commit('SET_USER', {
      displayName: username.value,
      email: user.email,
      uid: user.uid
    });

    // Redirect to Home after successful registration
    router.push('/');
  } catch (error) {
    console.error('Error during registration:', error.code);
    alert(handleError(error)); // Display error message to the user
  }
}

// Sign-in function
const signIn = async () => {
  try {
    // Use signInWithEmailAndPassword method to sign in a user
    const userCredential = await signInWithEmailAndPassword(auth, signInEmail.value, signInPassword.value);
    const user = userCredential.user;

    console.log('Successfully logged in!', user);

    // Fetch the user document from Firestore
    const userDoc = await getDoc(doc(db, "user", user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data(); // Retrieve user data (email, username, etc.)
      
      // Update Vuex store: Set user data and loggedIn status
      store.commit('SET_LOGGED_IN', true);
      store.commit('SET_USER', {
        displayName: userData.username, // Use the username from Firestore
        email: user.email,
        uid: user.uid
      });

      // Redirect to Home after successful login
      router.push('/');
    } else {
      console.error('User data not found in Firestore');
    }

  } catch (error) {
    console.error('Error during sign-in:', error.code);
    alert(handleError(error)); // Display error message to the user
  }
};

</script>

<script>
export default {
  mounted() {
    window.scrollTo(0, 0);
  },
  data() {
    return {
      isSignUpMode: false,
      };
  },
  methods: {
    toggleMode() {
      this.isSignUpMode = !this.isSignUpMode;
    }}};

</script>


<style scoped>

.container {
  margin: auto;
  padding-top: 80px;
}

* {
margin: 0;
padding: 0;
box-sizing: border-box;
}

body {
background-color: #f0f4f8;
position: relative;
}
.header {
background-color: white;
padding: 20px;
text-align: center;
}
.header h1 {
color: #36b598;
}
.main-banner {
background-color: #382a3e;
color: white;
text-align: center;
padding: 50px 20px;
border-radius: 15px;
position: relative;
overflow: hidden;
}
.main-banner h2 {
font-size: 2rem;
font-weight: bold;
}
.main-banner p {
margin-top: 15px;
font-size: 1.1rem;
}
.main-banner::before {
content: '';
position: absolute;
top: -100px;
right: -100px;
width: 200px;
height: 200px;
background: radial-gradient(circle, rgba(255,255,255,0.2), rgba(255,255,255,0));
border-radius: 50%;
z-index: 1;
}
.main-banner::after {
content: '';
position: absolute;
bottom: -150px;
left: -150px;
width: 300px;
height: 300px;
background: radial-gradient(circle, rgba(255,255,255,0.15), rgba(255,255,255,0));
border-radius: 50%;
z-index: 1;
}
.event-card {
border-radius: 15px;
align-items: center;
overflow: hidden;
}
.event-card img {
width: 800px; 
height: 400px; 
object-fit: cover;
}
.event-card p {
margin-top: 10px;
text-align: center;
font-weight: bold;
}

.navbar {
padding: 20px;
}

.navbar-brand {
color: #36b598 !important;
font-weight: bold;
}

.nav-link {
color: #000 !important;
margin-left: 15px;
}

.nav-link:hover {
color: #36b598 !important;
font-weight: bold;
}

@keyframes fade-in {
to { scale: 1; opacity: 1;}
}

@keyframes fade-out {
25% {opacity: 1}
50% {filter: blur(1px)}
75%, 100% { opacity: 0; scale: 1; filter: blur(1px)}
}
#eventCardsCarousel {
scale: .8; opacity:0;
animation: fade-in linear forwards;
animation-timeline: view();
animation-range: entry 200px;
}

#imgBanner {
animation: fade-out linear;
animation-timeline: view();
animation-range: exit;
}

#imgBanner img {
filter: grayscale(100%);

}

.position-relative {
position: relative;
}

.centered-text {
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
color: #36b598;; /* Adjust color for contrast */
font-size: 5rem;
font-weight: bold;
text-align: center;
width: 100%;
}

.container {

width: 100%;
background-color: #fff;
min-height: 100vh;
overflow: hidden;
}

.forms-container {
position: absolute;
width: 100%;
height: 100%;
padding-top: 80px;
top: 0;
left: 0;
}


.signin-signup {
position: absolute;
top: 50%;
transform: translate(-50%, -50%);
left: 75%;
width: 50%;
transition: 1s 0.7s ease-in-out;
display: grid;
grid-template-columns: 1fr;
z-index: 7;
}

form {
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
padding: 0rem 5rem;
transition: all 0.2s 0.7s;
overflow: hidden;
grid-column: 1 / 2;
grid-row: 1 / 2;
}

form.sign-up-form {
opacity: 0;
z-index: 1;
padding-top: 80px;
}

form.sign-in-form {
z-index: 2;
padding-top: 80px;
}

.title {
font-size: 2.2rem;
color: #444;
margin-bottom: 10px;
}

.input-field {
max-width: 380px;
width: 100%;
background-color: #f0f0f0;
margin: 10px 0;
height: 55px;
border-radius: 55px;
display: grid;
grid-template-columns: 15% 85%;
padding: 0 0.4rem;
position: relative;
}

.input-field i {
text-align: center;
line-height: 55px;
color: #acacac;
transition: 0.5s;
font-size: 1.1rem;
}

.input-field input {
background: none;
outline: none;
border: none;
line-height: 1;
font-weight: 600;
font-size: 1.1rem;
color: #333;
}

.input-field input::placeholder {
color: #aaa;
font-weight: 500;
}

.social-text {
padding: 0.7rem 0;
font-size: 1rem;
}

.social-media {
display: flex;
justify-content: center;
}

.social-icon {
height: 46px;
width: 46px;
display: flex;
justify-content: center;
align-items: center;
margin: 0 0.45rem;
color: #333;
border-radius: 50%;
border: 1px solid #333;
text-decoration: none;
font-size: 1.1rem;
transition: 0.3s;
}

.social-icon:hover {
color: #4481eb;
border-color: #4481eb;
}

.btn {
width: 150px;
background-color: #36b598;
border: none;
outline: none;
height: 49px;
border-radius: 49px;
color: #fff;
text-transform: uppercase;
font-weight: 600;
margin: 10px 0;
cursor: pointer;
transition: 0.5s;
}

.btn:hover{
  background-color: #16697a;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.panels-container {
position: absolute;
height: 100%;
width: 100%;
top: 0;
left: 0;
display: grid;
grid-template-columns: repeat(2, 1fr);
}

.container:before {
content: "";
position: absolute;
height: 2000px;
width: 2000px;
top: -10%;
right: 48%;
transform: translateY(-50%);
background-image: linear-gradient(-45deg, #191921 0%, #08f4bd 100%);
transition: 1.8s ease-in-out;
border-radius: 50%;
z-index: 6;
}

.image {
width: 80%;
transition: transform 1.1s ease-in-out;
transition-delay: 0.4s;
}

.panel {
display: flex;
flex-direction: column;
align-items: flex-end;
justify-content: space-around;
text-align: center;
z-index: 6;
}

.left-panel {
pointer-events: all;
padding: 3rem 17% 2rem 12%;
}

.right-panel {
pointer-events: none;
padding: 3rem 12% 2rem 17%;
}

.panel .content {
color: #fff;
transition: transform 0.9s ease-in-out;
transition-delay: 0.6s;
padding-top: 80px;
}

.panel h3 {
font-weight: 600;
line-height: 1;
font-size: 1.5rem;
}

.panel p {
font-size: 0.95rem;
padding: 0.7rem 0;
}

.btn.transparent {
margin: 0;
background: none;
border: 2px solid #fff;
width: 130px;
height: 41px;
font-weight: 600;
font-size: 0.8rem;
}

.btn.transparent:hover {
  background-color: white;
  color: black;
}

.right-panel .image,
.right-panel .content {
transform: translateX(800px);
}

/* ANIMATION */

.container.sign-up-mode:before {
transform: translate(100%, -50%);
right: 52%;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
transform: translateX(-800px);
}

.container.sign-up-mode .signin-signup {
left: 25%;
}

.container.sign-up-mode form.sign-up-form {
opacity: 1;
z-index: 2;
}

.container.sign-up-mode form.sign-in-form {
opacity: 0;
z-index: 1;
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
transform: translateX(0%);
}

.container.sign-up-mode .left-panel {
pointer-events: none;
}

.container.sign-up-mode .right-panel {
pointer-events: all;
}

@media (max-width: 870px) {
.container {
  min-height: 600px;
  height: 100vh;
}
.signin-signup {
  width: 100%;
  top: 95%;
  transform: translate(-50%, -100%);
  transition: 1s 0.8s ease-in-out;
}

.signin-signup,
.container.sign-up-mode .signin-signup {
  left: 50%;
}

.panels-container {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 2fr 1fr;
}

.panel {
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 2.5rem 8%;
  grid-column: 1 / 2;
}

.right-panel {
  grid-row: 3 / 4;
}

.left-panel {
  grid-row: 1 / 2;
}

.image {
  width: 200px;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.panel .content {
  padding-right: 15%;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.8s;
}

.panel h3 {
  font-size: 1.2rem;
}

.panel p {
  font-size: 0.7rem;
  padding: 0.5rem 0;
}

.btn.transparent {
  width: 110px;
  height: 35px;
  font-size: 0.7rem;
}

.container:before {
  width: 1500px;
  height: 1500px;
  transform: translateX(-50%);
  left: 30%;
  bottom: 68%;
  right: initial;
  top: initial;
  transition: 2s ease-in-out;
}

.container.sign-up-mode:before {
  transform: translate(-50%, 100%);
  bottom: 32%;
  right: initial;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateY(-300px);
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
  transform: translateY(0px);
}

.right-panel .image,
.right-panel .content {
  transform: translateY(300px);
}

.container.sign-up-mode .signin-signup {
  top: 5%;
  transform: translate(-50%, 0);
}
}

@media (max-width: 870px) {
form {
  padding: 0 1.5rem;
}

.image {
  display: none;
}
.left-panel .content {
  padding: 4rem 1rem;
}

.right-panel .content {
  padding: 4rem 1rem;
  padding-top: 21rem
}
.container {
  padding: 1.5rem;
}
.content p{
  display: none;
}

.content h3{
 padding-bottom: 1rem;
}
.container:before {
  bottom: 70%;
  left: 50%;
  z-index: 1;
}

.container.sign-up-mode:before {
  bottom: 20%;
  left: 50%;
}
}

</style>

<style>
.main-content[data-v-7ba5bd90] {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0px;
  max-width: 100%;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
  padding-top: 80px;
}

</style>