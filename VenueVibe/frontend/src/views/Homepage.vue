<template>
    <div>
        <!-- Splash Screen -->
        <div id="splash-screen" class="heading-montserrat">
            <div class="animated-text ">Welcome to <span class="fw-bold" style="color:#36b598;">Boothy</span></div>
        </div>

        <!-- Banner Section -->
        <div class="wrapper">
            <div class="left"></div>
            <div class="right"></div>

            <div class="container-fluid p-0 d-none d-md-block" id="imgBanner">
                <div class="position-relative">
                    <img src="../images/img3 - Copy.png" class="img-fluid w-100" alt="Banner Image" style="filter: brightness(0.8);">
                    <div class="centered-text" style="color:white;">
                        <span class="letter heading-montserrat">B</span>
                        <span class="letter heading-montserrat">o</span>
                        <span class="letter heading-montserrat">o</span>
                        <span class="letter heading-montserrat">t</span>
                        <span class="letter heading-montserrat">h</span>
                        <span class="letter heading-montserrat">y</span>
                    </div>
                </div>
            </div>
            

            <!-- Main Content Section -->
            <div class="container-fluid mt-5 main-content">
                <div class="main-banner">
                    <h2 class="heading-montserrat text-5xl tracking-tight">WHERE TO BOOTH?</h2>
                    <p>From bustling street markets to upscale fairs, find the right spaces to showcase your work and the right people to do it with. Find the right customers, maximise your space, and ensure a smooth experience at every event. Make each market or fair a success and unlock new opportunities for your business.</p>
                    <router-link to="/booths" class="btn green-btn mt-3 heading-montserrat">Find a Booth</router-link>
                </div>

                 <!-- Add the Video Carousel here -->
                <div class="section-title container-fluid glass-effect-video">
                    <h2 style="margin-bottom: 60px;"> Events Highlights</h2>
                 <VideoCarousel />  
                 <!-- <h1> </h1> -->
                 <p style="font-size: 12px; padding-top: 60px"> Tap on the TikTok icon to view the video with sound.</p>
                </div>

                <!-- 3D Carousel Section -->
                <div style="margin-bottom: 0px; padding-bottom: 0px;" class="section-title title-dark-glow">
                    <h2 >Gallery</h2>
                </div>
                <div class="carousel-container">
                    <input type="radio" name="slider" id="item-1" v-model="selectedItem" value="item-1" checked>
                    <input type="radio" name="slider" id="item-2" v-model="selectedItem" value="item-2">
                    <input type="radio" name="slider" id="item-3" v-model="selectedItem" value="item-3">

                    <div class="cards">
                        <label class="card" for="item-1" id="song-1">
                            <img src="../images/img10.jpg" alt="Event Image">
                        </label>
                        <label class="card" for="item-2" id="song-2">
                            <img src="../images/img9.jpg" alt="Event Image">
                        </label>
                        <label class="card" for="item-3" id="song-3">
                            <img src="../images/NAO.webp" alt="Event Image">
                        </label>
                    </div>

                    <div class="player glass-effect heading-montserrat">
                        <div class="upper-part">
                            <div class="info-area" id="test">
                                <div class="song-info" id="song-info-1">
                                    <div class="title">TGIF Bazaar @Sentosa Boardwalk</div>
                                    <div class="sub-line">
                                        <div class="subtitle">Event</div>
                                        <div class="time">2024</div>
                                    </div>
                                </div>
                                <div class="song-info " id="song-info-2">
                                    <div class="title">Merry Makers Market @FoundryArtCentre</div>
                                    <div class="sub-line">
                                        <div class="subtitle">Event</div>
                                        <div class="time">2024</div>
                                    </div>
                                </div>
                                <div class="song-info " id="song-info-3">
                                    <div class="title">Night At Orchard By INVADE</div>
                                    <div class="sub-line">
                                        <div class="subtitle">Event</div>
                                        <div class="time">2024</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="section-title title-dark-glow">
                <h2 style="margin-bottom: 30px;">So what are you waiting for?</h2>
                <router-link to="/login" class="btn green-btn mt-3 heading-montserrat">Log in / Sign up</router-link>
            </div>
            
        </div>
    </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoCarousel from '@/components/VideoCarousel.vue';

gsap.registerPlugin(ScrollTrigger);

export default {
    name: 'HomePage',
    components: {
        VideoCarousel
    },
    data() {
        return {
            selectedItem: 'item-1'
        }
    },
    mounted() {
        window.scrollTo(0, 0);
        // Initially lock scrolling
        document.body.style.overflow = 'hidden';

        // Splash screen hide logic
        setTimeout(() => {
            const splashScreen = document.getElementById('splash-screen');
            if (splashScreen) {
                splashScreen.classList.add('splash-hidden');
                // Unlock scrolling after splash screen is hidden
                document.body.style.overflow = 'auto';

                // GSAP animation sequence
                const timeline = gsap.timeline();

                // Animate the left and right divs
                timeline.to('.left', {
                    duration: 1,
                    width: '50%',
                    ease: "power2.inOut",
                }, 0.5);

                timeline.to('.right', {
                    duration: 1,
                    width: '50%',
                    ease: "power3.inOut",
                }, 0.4);

                // Animate the banner image sliding in from the left
                timeline.fromTo('#imgBanner img', {
                    x: '-100%',
                }, {
                    x: '0%',
                    duration: 1.5,
                    ease: "power2.inOut",
                });

                // Animate the main-banner sliding in from the left
                timeline.fromTo('.main-banner', {
                    x: '120%',
                }, {
                    x: '0%',
                    duration: 1.5,
                    ease: "power2.inOut",
                }, "<");

                // Animate the letters after the banner image has appeared
                timeline.fromTo(
                    ".letter",
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: "power2.out",
                    }
                );
            }
        }, 3000);
    },

    beforeRouteLeave(to, from, next) {
        // Ensure that scrolling is unlocked before navigating away
        document.body.style.overflow = 'auto';
        next();  // Proceed to the next route
    }
};
</script>

<style src="@/styles/review.css" scoped />

<style scoped>
@import url("https://fonts.googleapis.com/css?family=DM+Sans:400,500,700&display=swap");
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700&family=Montserrat:wght@600;700&display=swap');

.heading-inter { font-family: 'Inter', sans-serif; } 
.heading-playfair { font-family: 'Playfair Display', serif; } 
.heading-montserrat { font-family: 'Montserrat', sans-serif; }

body{
    background-image: url('@/images/img3.png');
    background-size:cover;
    
}
/* Splash Screen Style */
#splash-screen {
    position: fixed;
    width: 100%;
    height: 100vh;
    background-color: #1a1a1a;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 2rem;
    z-index: 10;
    transition: all 0.5s ease-in-out;
}

.animated-text {
    opacity: 0;
    animation: fadeInOut 3s ease-in-out;
    animation-fill-mode: forwards;
    
}

@keyframes fadeInOut {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
}

.splash-hidden {
    transform: translateY(-100%);
    opacity: 0;
}



/* Main Content Style */
.main-banner {
    background-color: rgba(255, 255, 255, 0.89);
    color: rgb(78, 76, 76);
    /* backdrop-filter: blur(10px); */
    text-align: center;
    padding: 50px 20px;
    border-radius: 15px;
    position: relative;
    overflow: hidden;
    /* margin-left: 27px;
    margin-right: 27px; */

}

.main-banner h2 {
    font-size: 2rem;
    font-weight: bold;
}

.main-banner p {
    margin-top: 15px;
    font-size: 1.1rem;
}

/* Carousel Styles */
.carousel-container {
    width: 100%;
    max-width: 800px;
    max-height: 600px;
    height: 100%;
    transform-style: preserve-3d;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    padding: 30px 10px;
}

input[type=radio] {
    display: none;
}

.card {
    position: absolute;
    width: 60%;
    height: 100%;
    left: 0;
    right: 0;
    margin: auto;
    transition: transform .4s ease;
    cursor: pointer;
}

.cards {
    position: relative;
    width: 100%;
    height: 400px;
    margin-bottom: 20px;
}

.card img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
}

/* Card positions */
#item-1:checked ~ .cards #song-3,
#item-2:checked ~ .cards #song-1,
#item-3:checked ~ .cards #song-2 {
    transform: translatex(-70%) scale(.8);
    opacity: .8;
    z-index: 0;
}

#item-1:checked ~ .cards #song-2,
#item-2:checked ~ .cards #song-3,
#item-3:checked ~ .cards #song-1 {
    transform: translatex(70%) scale(.8);
    opacity: .8;
    z-index: 0;
}

#item-1:checked ~ .cards #song-1,
#item-2:checked ~ .cards #song-2,
#item-3:checked ~ .cards #song-3 {
    transform: translatex(0) scale(1);
    opacity: 1;
    z-index: 1;
}

.player {
    width: 400px;
    height:100px;
    padding: 16px 10px;
    margin-top: 20px;
}

.glass-effect {
    height:120px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.upper-part {
    position: relative;
    display: flex;
    align-items: center;
    height: 100px;
    overflow: hidden;
}

.song-info {
    width: 100%;
    display: block;
    padding: 15px;
    margin-bottom: 10px;
    transition: all 0.3s ease;
}

.glass-card {
    background: rgba(54, 181, 152, 0.2);
    backdrop-filter: blur(5px);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.glass-card:hover {
    background: rgba(54, 181, 152, 0.3);
    transform: translateY(-2px);
}

.title {
    color: white;
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sub-line {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 8px;
}

.subtitle, .time {
    font-size: 13px;
    line-height: 16px;
    padding-right: 30px;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-area {
    width: 100%;
    position: absolute;
    top: 0;
    left: 10px;
    transition: transform .4s ease-in;
}

#item-2:checked ~ .player #test {
    transform: translateY(-100px);
}

#item-3:checked ~ .player #test {
    transform: translateY(-200px);
}

/* Banner and Animation Styles */
.left, .right {
    position: fixed;
    top: 0;
    height: 100vh;
    z-index: -1;
}

.left {
    background-image: url('@/images/img11.jpg');
    background-size: cover;  
    filter: brightness(100%) contrast(90%) ;
    left: 0%;
    width: 0%;
}

.right {
    background-image: url('@/images/img12.jpg');
    background-size: cover;  
    filter: brightness(100%) contrast(90%);
    right: 0%;
    width: 100%;
}

.position-relative {
    position: relative;
}

.centered-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #36b598;
    font-size: 5rem;
    font-weight: bold;
    text-align: center;
    width: 100%;
}

.letter {
    display: inline-block;
    opacity: 0;
    font-size: 100px;
    text-shadow: 
    0 0 10px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(0, 0, 0, 0.2),
    0 0 30px rgba(0, 0, 0, 0.2);
}

/* Main Content Layout */
.main-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 30px;
    max-width: 100%;
    margin: 0 auto;
    font-family: 'DM Sans', sans-serif;
    padding-top: 80px;
    padding-bottom: 80px;
}

.glass-effect-video {
    width: 100%;
    margin: 2rem auto;
    padding: 2rem;
    min-height: 600px; /* Base height for larger screens */
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    overflow: visible;
}

@media (max-width: 768px) {
    .glass-effect-video {
        padding: 1rem;
        margin: 1rem auto;
    }
}

@keyframes fade-in {
    to {
        scale: 1;
        opacity: 1;
    }
}

@keyframes fade-out {
    25% { opacity: 1 }
    50% { filter: blur(1px) }
    75%, 100% {
        opacity: 0;
        scale: 1;
        filter: blur(1px)
    }
}

#imgBanner {
    width:full ;
    animation: fade-out linear;
    animation-timeline: view();
    animation-range: exit;
}

.green-btn {
    background-color: #36b598;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  .green-btn:hover {
    background-color: #2d9b82;
    transform: translateY(-1px);
  }

  
  .green-btn:disabled {
    background-color: #a8d5c9;
    cursor: not-allowed;
    transform: none;
  }
  
  .h1{
  font-size: 2rem
}
</style>