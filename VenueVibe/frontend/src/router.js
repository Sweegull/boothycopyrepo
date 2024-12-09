import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Homepage.vue';
import Booth from './views/Booth.vue';
import BoothDetails from './views/BoothDetails.vue';
import EventReview from './views/EventReview.vue';
// import Organizers from './views/Organizers.vue';
// import Events from './views/Events.vue';
// import Contact from './views/Contact.vue';
import About from './views/About.vue';
import NotFound from './views/NotFound.vue';
import Collaboration from './views/Collaboration.vue';
import Login from './views/Login.vue';
import BusinessProfile from './views/BusinessProfile.vue';
import ApplicationProfiles from './views/ApplicationProfiles.vue';
import EventApplications from './views/EventApplications.vue';
import ApplicationReview from './views/ApplicationsApproval.vue';
import Payments from './views/Payments.vue';
import Chat from './views/CollaborationChat.vue';
import Profile from './views/Profile.vue';
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/apply', name: 'Apply', component: NotFound },
  { path: '/booths/:id', name: 'booth-details', component: BoothDetails, props: true},
  { path: '/booths', name: 'Booth', component: Booth },
  { path: '/eventreviews', name: 'Events', component: EventReview },
  { path: '/forum', name: 'Forum', component: NotFound },
  { path: '/collaborate', name: 'Collaborate', component: Collaboration},
  { path: '/CollaborateChat/:id?', name: 'CollaborateChat', component: Chat, props: true,},
  { path: '/about', name:'About', component: About },
  { path: '/login', name: 'Login', component: Login },
  { path: '/businessprofile', name: 'BusinessProfile', component: BusinessProfile },
  { path: '/applicationprofiles', name: 'ApplicationProfiles', component: ApplicationProfiles },
  // { path: '/applicationprofiles/:boothId', name: 'ApplicationProfiles', component: ApplicationProfiles },
  { path: '/eventapplications', name:'EventApplications', component: EventApplications},
  { path: '/applicationreview', name:'ApplicationReview', component: ApplicationReview},
  { path: '/payments/:boothId?', name: 'Payments', component: Payments, props: true },
  { path: '/profile', name:'Profile', component: Profile },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }  // Always scroll to top
  }
});

export default router;
