<template>
  <div class="about-page">
    <!-- Background Video -->
    <video
      class="background-video"
      autoplay
      muted
      loop
      playsinline
      @loadeddata="videoLoaded = true"
      :class="{ 'is-loaded': videoLoaded }"
    >
      <source src="/videos/store.mp4" type="video/mp4">
    </video>

    <!-- Video Overlay -->
    <div class="video-overlay"></div>

    <!-- Content Wrapper -->
    <div class="content-wrapper">
      <!-- Hero Section -->
      <section class="hero-section text-white py-5 mb-5">
        <div class="container">
          <div class="row align-items-center">
            <!-- Text Column -->
            <div class="col-md-6" data-aos="fade-right">
              <h1 class="display-4 fw-bold">About Us</h1>
              <p class="lead">Boothy was founded by a group of students from Singapore Management University 
                with the goal of creating a platform that allows event organizers to seamlessly discover and partner
                 with small businesses. </p>
            </div>
            <!-- Image Column -->
            <div class="col-md-6" data-aos="fade-left">
              <img 
                src="@/images/img6.jpg" 
                alt="About Us" 
                class="hero-image img-fluid"
                height=" 400px"
                data-aos="fade-left"
                style="border-radius: 20px;"
              >
            </div>
          </div>
        </div>
      </section>

      <!-- Mission Section -->
      <section class="mission-section mb-5">
        <div class="container">
          <div class="card transparent-card" data-aos="fade-up">
            <div class="card-body text-center">
              <h2 class="fw-bold mb-4">Our Mission</h2>
              <p class="lead">
                We're dedicated to creating meaningful connections between organizers 
                , small businesses, creators, artists from around the world to Singapore. Fostering growth and success in the events industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- What We Do Section -->
      <section class="features-section mb-5">
        <div class="container">
          <div class="row g-4">
            <!-- Connect Card -->
            <div class="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div class="feature-card">
                <div class="card-body text-center">
                  <i class="bi bi-people-fill feature-icon"></i>
                  <h3>Connect</h3>
                  <p>
                    We connect event organizers with the perfect small businesses 
                    to make their events unique and memorable.
                  </p>
                </div>
              </div>
            </div>

            <!-- Grow Card -->
            <div class="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div class="feature-card">
                <div class="card-body text-center">
                  <i class="bi bi-graph-up-arrow feature-icon"></i>
                  <h3>Grow</h3>
                  <p>
                    Help small businesses expand their reach and event organizers 
                    find the perfect partners for their events.
                  </p>
                </div>
              </div>
            </div>

            <!-- Succeed Card -->
            <div class="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div class="feature-card">
                <div class="card-body text-center">
                  <i class="bi bi-star-fill feature-icon"></i>
                  <h3>Succeed</h3>
                  <p>
                    Create successful partnerships that lead to outstanding events 
                    and business growth opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose Us Section -->
      <section class="benefits-section mb-5">
        <div class="container">
          <div class="card transparent-card" data-aos="fade-up">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-12">
                  <h2 class="fw-bold mb-4">Why Choose Us?</h2>
                  <ul class="benefits-list">
                    <li data-aos="fade-right" data-aos-delay="100">
                      <i class="bi bi-check-circle-fill"></i>
                      Easy-to-use platform for both organizers and businesses
                    </li>
                    <li data-aos="fade-right" data-aos-delay="200">
                      <i class="bi bi-check-circle-fill"></i>
                      Verified business profiles and reviews
                    </li>
                    <!-- <li data-aos="fade-right" data-aos-delay="300">
                      <i class="bi bi-check-circle-fill"></i>
                      Direct communication channels
                    </li> -->
                    <li data-aos="fade-right" data-aos-delay="400">
                      <i class="bi bi-check-circle-fill"></i>
                      Secure booking and payment system
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="cta-section py-5">
        <div class="container">
          <div class="row text-center">
            <div class="col-md-8 mx-auto" data-aos="fade-up">
              <h2 class="fw-bold mb-4">Ready to Get Started?</h2>
              <p class="lead mb-4">
                Join our platform today and start connecting with potential partners!
              </p>
              <router-link to="/login" class="cta-button">
                Join Now
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      videoLoaded: false
    }
  }
}
</script>

<style scoped>
/* Base Styles */
.about-page {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  color: #ffffff;
}

/* Video Background */
.background-video {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -2;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.background-video.is-loaded {
  opacity: 1;
}

/* Overlay */
.video-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: -1;
}

/* Content Wrapper */
.content-wrapper {
  position: relative;
  z-index: 1;
}

/* Hero Section */
.hero-section {
  padding: 100px 0;
}

.hero-section h1,
.hero-section p {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* Cards */
.transparent-card {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  color: white;
}

.feature-card {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 30px;
  height: 100%;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  background-color: rgba(255, 255, 255, 0.2);
}

/* Feature Icons */
.feature-icon {
  font-size: 3rem;
  color: #36b598;
  margin-bottom: 1.5rem;
  display: block;
}

/* Benefits List */
.benefits-list {
  list-style: none;
  padding: 0;
}

.benefits-list li {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
}

.benefits-list li i {
  color: #36b598;
  margin-right: 1rem;
  font-size: 1.25rem;
}

/* CTA Section */
.cta-section {
  background-color: rgba(54, 181, 152, 0.8);
  margin-top: 4rem;
}

.cta-button {
  display: inline-block;
  padding: 15px 40px;
  background-color: white;
  color: #36b598;
  text-decoration: none;
  border-radius: 30px;
  font-weight: bold;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  color: #36b598;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0;
  }

  .feature-card {
    margin-bottom: 20px;
  }
}

/* Remove scrollbar */
.about-page {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.about-page::-webkit-scrollbar {
  display: none;
}
</style>