<template>
  <div class="min-h-screen bg-[#FDFCFB] flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl"></div>

    <div class="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 md:p-12 relative z-10 border border-gray-100">
      
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
        <h2 class="text-2xl font-semibold text-gray-800 animate-pulse">Verifying your payment...</h2>
        <p class="text-gray-500 mt-2">Please hold on while we confirm your consultation.</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-10">
        <div class="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <lucide-x-circle :size="48" />
        </div>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Verification Failed</h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">{{ error }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/" class="px-8 py-4 bg-primary text-white rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25">
            Return Home
          </NuxtLink>
        </div>
      </div>

      <!-- Success State -->
      <div v-else-if="verificationResult" class="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div class="text-center mb-10">
          <div class="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <lucide-check-circle-2 :size="56" />
          </div>
          <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Consultation Confirmed!</h1>
          <p class="text-lg text-gray-600">Your journey to wellness starts now. We've sent the details to your email.</p>
        </div>

        <!-- Booking Details Card -->
        <div class="bg-gray-50 rounded-2xl p-6 md:p-8 mb-8 border border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-1">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Package</span>
              <p class="text-lg font-semibold text-gray-800">{{ verificationResult.packageId?.name || 'Standard Consultation' }}</p>
            </div>
            <div class="space-y-1">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Reference</span>
              <p class="text-lg font-mono text-gray-600">{{ verificationResult.paymentReference }}</p>
            </div>
            <div class="space-y-1">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Date & Time</span>
              <p class="text-lg font-semibold text-gray-800">
                {{ formatDate(verificationResult.startTime) }}
              </p>
            </div>
            <div v-if="verificationResult.meetingLink" class="space-y-1">
              <span class="text-xs font-bold uppercase tracking-wider text-gray-400">Virtual Meeting</span>
              <a :href="verificationResult.meetingLink" target="_blank" class="flex items-center text-primary font-semibold hover:underline group">
                Join Meeting
                <lucide-external-link :size="16" class="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div v-if="verificationResult.meetingLink" class="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-start gap-3">
            <lucide-info :size="20" class="text-primary mt-0.5 shrink-0" />
            <p class="text-sm text-gray-700">
              The Google Meet link is also available in your calendar invitation and confirmation email.
            </p>
          </div>

          <div class="pt-6 flex flex-col sm:flex-row gap-4">
            <NuxtLink to="/" class="px-8 py-4 bg-gray-900 w-full text-white rounded-full font-medium transition-all hover:bg-black hover:shadow-xl active:scale-95 text-center">
              Back to Dashboard
            </NuxtLink>
            <button @click="addToCalendar" class="px-8 py-4 w-full bg-white text-gray-900 border border-gray-200 rounded-full font-medium transition-all hover:bg-gray-50 active:scale-95 flex items-center justify-center gap-2">
              <lucide-calendar :size="18" />
              Add to Calendar
            </button>
          </div>
        </div>
      </div>

      <!-- Fallback (if mounted without ref) -->
      <div v-else class="text-center py-10">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">No Session Found</h2>
        <p class="text-gray-600 mb-8">It seems like you've reached this page without a valid booking reference.</p>
        <NuxtLink to="/" class="inline-block px-8 py-4 bg-primary text-white rounded-full font-medium transition-all">
          Go to Home
        </NuxtLink>
      </div>
    </div>

    <!-- Help text footer -->
    <p class="mt-8 text-gray-400 text-sm">
      Need help? Contact us at <a href="mailto:support@lolaapril.com" class="text-primary hover:underline">support@lolaapril.com</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useVerifyConsultation } from '@/composables/modules/consultation/useVerifyConsultation';
import * as lucide from 'lucide-vue-next';

// Mapping lucide icons manually since we're using lucide-vue-next
const { 
  CheckCircle2: lucideCheckCircle2, 
  XCircle: lucideXCircle, 
  ExternalLink: lucideExternalLink,
  Calendar: lucideCalendar,
  Info: lucideInfo
} = lucide;

const route = useRoute();
const { loading, verificationResult, error, verifyPayment } = useVerifyConsultation();

onMounted(async () => {
  const queryRef = route.query.reference;
  const reference = Array.isArray(queryRef) ? queryRef[0] : queryRef as string;
  
  if (reference) {
    await verifyPayment(reference);
  } else {
    error.value = "Missing payment reference in URL.";
  }
});

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }) + ' at ' + date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const addToCalendar = () => {
  if (!verificationResult.value) return;
  
  const { startTime, endTime, packageId, meetingLink } = verificationResult.value;
  const title = `Consultation: ${packageId?.name || 'Standard Consultation'}`;
  const details = `Virtual consultation. ${meetingLink ? 'Join here: ' + meetingLink : ''}`;
  
  const start = new Date(startTime).toISOString().replace(/-|:|\.\d+/g, '');
  const end = new Date(endTime).toISOString().replace(/-|:|\.\d+/g, '');
  
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(meetingLink || 'Virtual')}`;
  
  window.open(googleCalendarUrl, '_blank');
};
</script>

<style scoped>
.font-extrabold {
  font-family: 'Roobert PRO', sans-serif;
  letter-spacing: -0.02em;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-bottom {
  from { transform: translateY(1rem); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-in {
  animation: fade-in 0.5s ease-out forwards;
}

.slide-in-from-bottom-4 {
  animation: slide-in-bottom 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
