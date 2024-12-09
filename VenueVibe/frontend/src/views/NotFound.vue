<template>
    <div class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <router-link to="/">Go back to Home</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotFound",
  };
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 100px;
  }
  
  .not-found h1 {
    font-size: 48px;
    color: #ff7f50;
  }
  
  .not-found p {
    font-size: 18px;
    margin: 20px 0;
  }
  
  .not-found a {
    font-size: 16px;
    color: #16697a;
    text-decoration: underline;
  }
  </style>
  