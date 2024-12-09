import axios from 'axios';

const boothAPI = axios.create({
  baseURL: '/api/booths', // Booth Listing service URL
});

// const eventAPI = axios.create({
//   baseURL: 'http://localhost:8081', // Event service URL
// });

// const businessAPI = axios.create({
//   baseURL: 'http://localhost:8082', // Business profile service URL
// });

// export { boothAPI, eventAPI, businessAPI };

export {boothAPI};