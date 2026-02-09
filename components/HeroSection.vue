<template>
  <section class="relative h-screen flex items-center justify-center bg-parentPrimary text-white overflow-hidden">
    <!-- Local Video Background -->
    <div class="absolute inset-0 w-full h-full z-0">
      <video autoplay muted loop playsinline class="hero-video-bg">
        <source src="@/assets/videos/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <!-- Overlay for color blending -->
      <div class="absolute inset-0 bg-[#005967] opacity-90"></div>
    </div>

    <!-- Hero Content -->
    <div class="relative z-10 text-center px-6 flex flex-col items-center justify-center w-full h-full">
      <h1 class="text-[3rem] md:text-[5rem] lg:text-[6rem] font-light mb-8 animate-fade-in leading-tight tracking-tight" style="letter-spacing:-0.02em;">
        Outside Health
      </h1>
      <h2 class="text-[2.5rem] md:text-[4.5rem] lg:text-[5.5rem] font-light mb-12 animate-fade-in-delay leading-tight tracking-tight">
        Starts <span class="relative inline-block">
          Inside
          <span class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-200 via-yellow-300 to-transparent rounded" style="height:0.5em;"></span>
        </span>
      </h2>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20">
      <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </section>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Video background styles */

.hero-video-bg {
  position: absolute;
  inset: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
}

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 1s ease-out 0.3s backwards;
}

@media (max-width: 768px) {
  .vc_video-bg,
  .vc_video-bg iframe.inner {
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
  }
  .hero-content h1,
  .hero-content h2 {
    font-size: 2rem !important;
    line-height: 1.1;
  }
}
</style>