<template>
  <section class="relative h-screen flex items-center justify-center bg-primary text-white overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary"></div>
    
    <div class="relative z-10 text-center px-6">
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-light mb-8 animate-fade-in">
        Outside Health
      </h1>
      <h2 class="text-5xl md:text-7xl lg:text-8xl font-light mb-12 animate-fade-in-delay">
        Starts <span class="relative inline-block">
          Inside
          <span class="absolute bottom-0 left-0 right-0 h-1 bg-accent"></span>
        </span>
      </h2>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
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

.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 1s ease-out 0.3s backwards;
}
</style>