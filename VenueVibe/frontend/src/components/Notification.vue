<template>
    <div v-if="visible" class="notification" :class="type">
      <h4>{{ title }}</h4>
      <p>{{ message }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      type: { type: String, default: 'success' },
      title: { type: String, required: true },
      message: { type: String, required: true },
      duration: { type: Number, default: 3000 } // time in ms
    },
    data() {
      return {
        visible: true
      }
    },
    mounted() {
      setTimeout(() => {
        this.visible = false;
      }, this.duration);
    }
  }
  </script>
  
  <style>
.notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centers the modal */
  width: 400px; /* Set the width for the modal */
  padding: 20px;
  background-color: white; /* White background for the modal */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Shadow effect */
  opacity: 1; /* Default opacity */
  z-index: 9999; /* Ensure it appears above other content */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: opacity 0.3s ease-in-out;
  color: black; /* Text color */
  max-width: 100%; /* Ensure it doesn't go beyond the screen width */
  box-sizing: border-box;
}

.notification.success {
  border-left: 10px solid green; /* Optional border to indicate success */
}

.notification.error {
  border-left: 10px solid red; /* Optional border to indicate error */
}

.notification h4 {
  margin: 0 0 10px 0;
  font-size: 18px;
  font-weight: bold;
}

.notification p {
  margin: 0;
  font-size: 14px;
}

.notification.hidden {
  opacity: 0;
  pointer-events: none;
}

  </style>
  