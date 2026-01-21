<template>
  <Teleport to="body">
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-white overflow-y-auto"
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <!-- Back Button -->
          <button 
            v-if="currentStep > 1"
            @click="goBack"
            class="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div v-else class="w-10"></div>

          <!-- Progress Breadcrumb -->
          <div class="flex items-center space-x-2 text-sm">
            <span :class="currentStep >= 1 ? 'text-gray-900 font-medium' : 'text-gray-400'">Services</span>
            <span class="text-gray-300">›</span>
            <span :class="currentStep >= 2 ? 'text-gray-900 font-medium' : 'text-gray-400'">Time</span>
            <span class="text-gray-300">›</span>
            <span :class="currentStep >= 3 ? 'text-gray-900 font-medium' : 'text-gray-400'">Confirm</span>
          </div>

          <!-- Close Button -->
          <button 
            @click="closeModal"
            class="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-3 gap-8 p-4 lg:p-8">
          <!-- Left Content Area -->
          <div class="lg:col-span-2">
            <!-- Step 1: Service Selection -->
            <div v-show="currentStep === 1">
              <h1 class="text-2xl font-bold text-gray-900 mb-2">Services</h1>
              <p class="text-gray-600 mb-8">Choose the services you'd like to book</p>

              <!-- Category Tabs -->
              <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                  v-for="category in serviceCategories"
                  :key="category"
                  @click="selectedCategory = category"
                  :class="[
                    'px-4 py-2 rounded-full font-medium whitespace-nowrap transition',
                    selectedCategory === category
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ category?.categoryName }}
                </button>
              </div>

              <!-- Services Grid -->
              <div v-if="servicesLoading" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="service in filteredServices"
                  :key="service._id"
                  class="bg-white rounded-lg border border-gray-50 transition cursor-pointer p-4"
                  :class="isServiceInCart(service._id) ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'"
                  @click="handleServiceClick(service)"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="font-semibold text-lg mb-1">{{ service.basicDetails.serviceName }}</h3>
                      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                        {{ service.basicDetails.description }}
                      </p>
                      <div class="flex items-center gap-4 text-sm text-gray-500">
                        <span>{{ formatDuration(service.pricingAndDuration.duration.servicingTime) }}</span>
                        <span class="font-bold text-gray-900">{{ formatPrice(service.pricingAndDuration.price) }}</span>
                      </div>
                    </div>
                    <button
                      @click.stop="toggleServiceInCart(service)"
                      class="ml-4 w-8 h-8 rounded-full flex items-center justify-center transition"
                      :class="isServiceInCart(service._id) ? 'bg-primary text-white' : 'border-2 border-gray-300'"
                    >
                      <svg v-if="isServiceInCart(service._id)" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      <span v-else class="text-2xl leading-none">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Date & Time Selection -->
            <div v-show="currentStep === 2">
              <h1 class="text-xl font-bold text-gray-900 mb-2">Select time</h1>
              <p class="text-gray-600 text-sm mb-8">Choose your preferred date and time</p>

              <!-- Calendar Icon for Date Picker -->
              <button
                @click="showDatePicker = !showDatePicker"
                class="mb-6 px-4 py-2 border-[0.5px] border-gray-100 rounded-lg flex items-center gap-2 hover:bg-gray-50"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDisplayDate(selectedDate) || 'Select date' }}</span>
              </button>

              <!-- Date Picker Dropdown -->
              <div v-if="showDatePicker" class="mb-6 bg-white border-[0.5px] border-gray-100 rounded-lg p-4 shadow-lg">
                <div class="flex items-center justify-between mb-4">
                  <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 class="font-semibold">{{ currentMonthYear }}</h3>
                  <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div class="grid grid-cols-7 gap-2 text-center">
                  <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day" class="text-xs text-gray-500 font-medium py-2">
                    {{ day }}
                  </div>
                  <div
                    v-for="date in calendarDates"
                    :key="date.dateString"
                    @click="selectDate(date)"
                    :class="[
                      'py-2 rounded-lg cursor-pointer transition',
                      !date.isCurrentMonth ? 'text-gray-300' : '',
                      date.isToday ? 'font-bold' : '',
                      date.dateString === selectedDate ? 'bg-primary text-white' : 'hover:bg-gray-100',
                      !date.isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                    ]"
                  >
                    {{ date.day }}
                  </div>
                </div>
              </div>

              <!-- Week Days Quick Select -->
              <div class="flex gap-3 mb-8 overflow-x-auto pb-2">
                <button
                  v-for="day in upcomingDays"
                  :key="day.dateString"
                  @click="selectDateFromQuick(day)"
                  :class="[
                    'flex-shrink-0 text-center py-3 px-5 rounded-full border-[0.5px] border-gray-100 transition',
                    selectedDate === day.dateString
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div class="text-2xl font-bold">{{ day.day }}</div>
                  <div class="text-xs">{{ day.weekday }}</div>
                </button>
              </div>

              <!-- Time Slots -->
              <div v-if="timeSlotsLoading" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>

              <div v-else-if="selectedDate && timeSlots.length > 0">
                <h3 class="font-semibold mb-4">Available times</h3>
                <div class="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  <button
                    v-for="slot in timeSlots"
                    :key="slot.startTime"
                    @click="selectTimeSlot(slot.startTime)"
                    :class="[
                      'py-3 rounded-full text-sm font-medium transition border-[0.5px] border-gray-100',
                      selectedTime === slot.startTime
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white border-gray-200 hover:border-primary'
                    ]"
                  >
                    {{ formatTime(slot.startTime) }}
                  </button>
                </div>
              </div>

              <div v-else-if="selectedDate" class="text-center py-12 bg-gray-50 rounded-lg">
                <p class="text-gray-500">No available slots for this date</p>
              </div>

              <div v-else class="text-center py-12 bg-gray-50 rounded-lg">
                <p class="text-gray-500">Please select a date to view available times</p>
              </div>
            </div>

            <!-- Step 3: Review and Confirm -->
            <div v-show="currentStep === 3">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Review and confirm</h1>
              <p class="text-gray-600 mb-8">Please review your booking details</p>

              <!-- Payment Method -->
              <div class="mb-6">
                <h3 class="font-semibold mb-3">Payment method</h3>
                <div class="border-[0.5px] border-gray-100 rounded-lg p-4 py-6 flex items-center gap-3">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span class="font-medium">Pay with Paystack</span>
                </div>
              </div>

              <!-- Cancellation Policy -->
              <div class="mb-6 p-4 py-6 bg-gray-25 border-[0.5px] border-gray-100 rounded-lg">
                <h3 class="font-semibold mb-2">Cancellation policy</h3>
                <p class="text-sm text-gray-700">Please cancel at least <strong>2 hours before</strong> appointment.</p>
              </div>

              <!-- Important Info -->
              <div class="mb-6">
                <h3 class="font-semibold mb-2">Important info</h3>
                <p class="text-sm text-gray-600 leading-relaxed">
                  Appointments are confirmed upon payment. Unconfirmed appointments will be released after 2 hours from the time of booking. Kindly ensure timely payment to secure your booking.
                </p>
              </div>

              <!-- Booking Notes -->
              <div class="mb-6">
                <UiAnimatedInput
                  v-model="bookingNotes"
                  label="Booking notes"
                  type="textarea"
                  :rows="10"
                  :cols="10"
                />
              </div>
            </div>
          </div>

          <!-- Right Sidebar - Cart/Summary -->
          <div class="lg:col-span-1">
            <div class="bg-white border-[0.5px] border-gray-100 rounded-lg p-6 sticky top-24">
              <!-- Business Info -->
              <div class="flex items-center gap-3 mb-6 pb-6 border-b">
                <img
                  v-if="business?.logo"
                  :src="business.logo"
                  alt="Business"
                  class="w-12 h-12 rounded-lg object-cover"
                />
                <div v-else class="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <span class="text-gray-500 font-bold text-lg">{{ business?.businessName?.charAt(0) }}</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-sm">{{ business?.businessName }}</h3>
                  <div class="flex items-center gap-1 text-xs text-gray-600">
                    <span class="text-yellow-500">★</span>
                    <span>4.9</span>
                    <span class="text-gray-400">(61)</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">{{ business?.address?.street }}</p>
                </div>
              </div>

              <!-- Cart Items -->
              <div v-if="cart.length === 0" class="text-center py-8 text-gray-400">
                <p class="text-sm">No services selected</p>
              </div>

              <div v-else class="space-y-4 mb-6">
                <!-- Selected Date & Time -->
                <div v-if="selectedDate" class="text-sm">
                  <div class="flex items-center gap-2 text-gray-600 mb-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{{ formatDisplayDate(selectedDate) }}</span>
                  </div>
                  <div v-if="selectedTime" class="flex items-center gap-2 text-gray-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ formatTime(selectedTime) }}</span>
                  </div>
                </div>

                <!-- Services in Cart -->
                <div
                  v-for="item in cart"
                  :key="item.service._id"
                  class="border-t pt-4"
                >
                  <div class="flex justify-between items-start mb-1">
                    <h4 class="font-medium text-sm flex-1">{{ item.service.basicDetails.serviceName }}</h4>
                    <button
                      @click="removeFromCart(item.service._id)"
                      class="text-gray-400 hover:text-red-500 ml-2"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div class="text-xs text-gray-500 mb-2">
                    {{ formatDuration(item.service.pricingAndDuration.duration.servicingTime) }}
                    <span v-if="item.selectedVariant"> • {{ item.selectedVariant.name }}</span>
                  </div>
                  <div class="font-semibold text-sm">
                    {{ formatPrice(item.selectedVariant?.price || item.service.pricingAndDuration.price) }}
                  </div>
                </div>
              </div>

              <!-- Total -->
              <div v-if="cart.length > 0" class="border-t pt-4">
                <div class="flex justify-between items-center mb-4">
                  <span class="font-bold">Total</span>
                  <span class="font-bold text-xl">{{ formatPrice(totalPrice) }}</span>
                </div>

                <!-- Continue Button -->
                <button
                  v-if="currentStep === 1"
                  @click="proceedToDateTime"
                  :disabled="cart.length === 0"
                  class="w-full bg-gray-900 text-white font-bold py-4 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
                >
                  Continue
                </button>

                <button
                  v-else-if="currentStep === 2"
                  @click="proceedToConfirm"
                  :disabled="!selectedDate || !selectedTime"
                  class="w-full bg-gray-900 text-white font-bold py-4 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
                >
                  Continue
                </button>

                <button
                  v-else-if="currentStep === 3"
                  @click="confirmBooking"
                  :disabled="bookingLoading"
                  class="w-full bg-gray-900 text-white font-bold py-4 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
                >
                  <span v-if="bookingLoading">Processing...</span>
                  <span v-else>Confirm</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Service Variant Modal -->
      <Teleport to="body" v-if="showVariantModal && selectedServiceForVariant">
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div class="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div class="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 class="text-xl font-bold">{{ selectedServiceForVariant.basicDetails.serviceName }}</h2>
              <button
                @click="closeVariantModal"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="p-6">
              <p class="text-gray-600 text-sm mb-6">
                {{ selectedServiceForVariant.basicDetails.description }}
              </p>

              <h3 class="font-semibold mb-4">Select an option *</h3>

              <div class="space-y-3">
                <div
                  v-for="variant in selectedServiceForVariant.pricingAndDuration.variants"
                  :key="variant.name"
                  @click="selectVariant(variant)"
                  :class="[
                    'p-4 border-2 rounded-lg cursor-pointer transition',
                    selectedVariant?.name === variant.name
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <h4 class="font-medium mb-1">{{ variant.name }}</h4>
                      <p class="text-sm text-gray-500">{{ formatDuration(variant.duration.servicingTime) }}</p>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="font-bold">{{ formatPrice(variant.price) }}</span>
                      <div
                        :class="[
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                          selectedVariant?.name === variant.name
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                        ]"
                      >
                        <svg v-if="selectedVariant?.name === variant.name" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 pt-6 border-t">
                <div class="flex items-center justify-between mb-4">
                  <span class="font-bold">
                    {{ selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(selectedServiceForVariant.pricingAndDuration.price) }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{ selectedVariant ? formatDuration(selectedVariant.duration.servicingTime) : formatDuration(selectedServiceForVariant.pricingAndDuration.duration.servicingTime) }}
                  </span>
                </div>

                <button
                  @click="addVariantServiceToCart"
                  :disabled="!selectedVariant && selectedServiceForVariant.pricingAndDuration.variants?.length > 0"
                  class="w-full bg-gray-900 text-white font-bold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
                >
                  Add to booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Add Extra Service Modal (After Time Selection) -->
      <Teleport to="body" v-if="showExtraServiceModal">
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center backdrop-blur-xl justify-center z-[60] p-4">
          <div class="bg-white rounded-2xl max-w-3xl w-full">
            <div class="p-6 border-b-[0.5px] border-gray-25 flex items-center justify-between">
              <h2 class="text-xl font-bold">Add an extra service?</h2>
              <button
                @click="skipExtraService"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="p-6 space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="service in availableExtraServices"
                :key="service._id"
                @click="addExtraService(service)"
                class="p-4 border-[0.5px] border-gray-100 rounded-lg hover:border-primary cursor-pointer transition"
              >
                <h3 class="font-medium mb-1">{{ service.basicDetails.serviceName }}</h3>
                <p class="text-sm text-gray-500 mb-2">{{ formatDuration(service.pricingAndDuration.duration.servicingTime) }}</p>
                <span class="font-bold">{{ formatPrice(service.pricingAndDuration.price) }}</span>
              </div>
            </div>

            <div class="p-6 pt-6 border-t border-gray-100">
              <button
                @click="skipExtraService"
                class="w-full py-3.5 border-[0.5px] border-gray-100 rounded-full bg-black text-white font-medium transition"
              >
                No, thanks
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Auth Modal -->
      <Teleport to="body" v-if="showAuthModal">
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div class="bg-white rounded-2xl max-w-md w-full">
            <div class="p-6">
              <h2 class="text-2xl font-bold mb-2">Log in or sign up</h2>
              <p class="text-gray-600 text-sm mb-6">Log in or sign up to complete your booking</p>

              <!-- Tab Navigation -->
              <div class="flex gap-4 mb-6 border-b border-gray-200">
                <button
                  @click="authTab = 'login'"
                  :class="[
                    'pb-2 font-medium transition',
                    authTab === 'login'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-800'
                  ]"
                >
                  Login
                </button>
                <button
                  @click="authTab = 'signup'"
                  :class="[
                    'pb-2 font-medium transition',
                    authTab === 'signup'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-800'
                  ]"
                >
                  Sign Up
                </button>
              </div>

              <!-- Login Form -->
              <form v-if="authTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
                <div>
                  <label class="block text-gray-700 font-medium mb-1 text-sm">Email</label>
                  <input
                    v-model="loginForm.email"
                    type="email"
                    required
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-1 text-sm">Password</label>
                  <input
                    v-model="loginForm.password"
                    type="password"
                    required
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div v-if="loginError" class="text-red-500 text-sm">{{ loginError }}</div>
                <button
                  type="submit"
                  :disabled="loginLoading"
                  class="w-full bg-primary text-white font-bold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="loginLoading">Logging in...</span>
                  <span v-else>Continue</span>
                </button>
              </form>

              <!-- Signup Form -->
              <form v-else @submit.prevent="handleSignup" class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-gray-700 font-medium mb-1 text-sm">First Name</label>
                    <input
                      v-model="signupForm.firstName"
                      type="text"
                      required
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-700 font-medium mb-1 text-sm">Last Name</label>
                    <input
                      v-model="signupForm.lastName"
                      type="text"
                      required
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-1 text-sm">Email</label>
                  <input
                    v-model="signupForm.email"
                    type="email"
                    required
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-1 text-sm">Phone Number</label>
                  <input
                    v-model="signupForm.phone"
                    type="tel"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="+234..."
                  />
                </div>
                <div>
                  <label class="block text-gray-700 font-medium mb-1 text-sm">Password</label>
                  <input
                    v-model="signupForm.password"
                    type="password"
                    required
                    minlength="6"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="••••••••"
                  />
                  <p class="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
                </div>
                <div v-if="signupError" class="text-red-500 text-sm">{{ signupError }}</div>
                <button
                  type="submit"
                  :disabled="signupLoading"
                  class="w-full bg-primary text-white font-bold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="signupLoading">Creating Account...</span>
                  <span v-else>Continue</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGetBusiness } from '@/composables/modules/business/useGetBusiness'
import { useGetServices } from '@/composables/modules/services/useGetServices'
import { useGetAvailableSlots } from '@/composables/modules/availability/useGetAvailableSlots'
import { useGetAllSlots } from '@/composables/modules/availability/useGetAllSlots'
import { useCreateBooking } from '@/composables/modules/booking/useCreateBooking'
import { useInitializePayment } from '@/composables/modules/payment/useInitializePayment'
import { useLogin } from '@/composables/modules/auth/useLogin'
import { useRegister } from '@/composables/modules/auth/useRegister'

// Props
const props = defineProps<{
  isOpen: boolean
}>()

// Emits
const emit = defineEmits(['close', 'success'])

// Route
const route = useRoute()

// Composables
const { business } = useGetBusiness()
const { services, loading: servicesLoading, getServices } = useGetServices()
const { slots: availableSlots, loading: timeSlotsLoading, getAvailableSlots } = useGetAvailableSlots()
const { getAllSlots } = useGetAllSlots()
const { createBooking, loading: bookingLoading } = useCreateBooking()
const { initializePayment } = useInitializePayment()
const { login, loading: loginLoading, error: loginError } = useLogin()
const { register, loading: signupLoading, error: signupError } = useRegister()

// State
const currentStep = ref(1) // 1: Services, 2: Date/Time, 3: Confirm
const selectedCategory = ref('Featured')
const cart = ref<Array<{ service: any; selectedVariant?: any }>>([])
const selectedDate = ref<string | null>(null)
const selectedTime = ref<string | null>(null)
const bookingNotes = ref('')

// Service variant modal
const showVariantModal = ref(false)
const selectedServiceForVariant = ref<any>(null)
const selectedVariant = ref<any>(null)

// Extra service modal
const showExtraServiceModal = ref(false)

// Auth modal
const showAuthModal = ref(false)
const authTab = ref<'login' | 'signup'>('login')
const isAuthenticated = ref(false)
const currentUser = ref<any>(null)

// Auth forms
const loginForm = reactive({
  email: '',
  password: ''
})

const signupForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: 'client'
})

// Calendar state
const showDatePicker = ref(false)
const calendarMonth = ref(new Date().getMonth())
const calendarYear = ref(new Date().getFullYear())

// Computed
const serviceCategories = computed(() => {
  const categories = new Set(['Featured'])
  services.value?.forEach((service: any) => {
    if (service.basicDetails.category) {
      categories.add(service.basicDetails.category)
    }
  })
  return Array.from(categories)
})

const filteredServices = computed(() => {
  if (selectedCategory.value === 'Featured') {
    return services.value
  }
  return services.value?.filter((s: any) => s.basicDetails.category === selectedCategory.value)
})

const timeSlots = computed(() => {
  if (!availableSlots.value) return []
  return availableSlots.value.filter((slot: any) => slot.isBookable !== false)
})

const totalPrice = computed(() => {
  let total = { amount: 0, currency: 'NGN' }
  cart.value.forEach(item => {
    const price = item.selectedVariant?.price || item.service.pricingAndDuration.price
    total.amount += price.amount
    total.currency = price.currency
  })
  return total
})

const availableExtraServices = computed(() => {
  return services.value?.filter((s: any) => 
    !cart.value.some(item => item.service._id === s._id)
  ) || []
})

const currentMonthYear = computed(() => {
  const date = new Date(calendarYear.value, calendarMonth.value)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const calendarDates = computed(() => {
  const dates = []
  const firstDay = new Date(calendarYear.value, calendarMonth.value, 1)
  const lastDay = new Date(calendarYear.value, calendarMonth.value + 1, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Get day of week (0 = Sunday, adjust to Monday = 0)
  let dayOfWeek = firstDay.getDay()
  dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  // Add previous month days
  const prevMonthLastDay = new Date(calendarYear.value, calendarMonth.value, 0).getDate()
  for (let i = dayOfWeek - 1; i >= 0; i--) {
    dates.push({
      day: prevMonthLastDay - i,
      dateString: '',
      isCurrentMonth: false,
      isToday: false,
      isAvailable: false
    })
  }

  // Add current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(calendarYear.value, calendarMonth.value, i)
    const dateString = date.toISOString().split('T')[0]
    const isToday = date.getTime() === today.getTime()
    const isPast = date < today

    dates.push({
      day: i,
      dateString,
      isCurrentMonth: true,
      isToday,
      isAvailable: !isPast
    })
  }

  // Add next month days to complete the grid
  const remainingDays = 42 - dates.length
  for (let i = 1; i <= remainingDays; i++) {
    dates.push({
      day: i,
      dateString: '',
      isCurrentMonth: false,
      isToday: false,
      isAvailable: false
    })
  }

  return dates
})

const upcomingDays = computed(() => {
  const days = []
  const today = new Date()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    days.push({
      day: date.getDate(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dateString: date.toISOString().split('T')[0]
    })
  }
  
  return days
})

// Methods
const closeModal = () => {
  emit('close')
}

const goBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const isServiceInCart = (serviceId: string) => {
  return cart.value.some(item => item.service._id === serviceId)
}

const handleServiceClick = (service: any) => {
  // Check if service has variants
  if (service.pricingAndDuration.variants && service.pricingAndDuration.variants.length > 0) {
    selectedServiceForVariant.value = service
    selectedVariant.value = null
    showVariantModal.value = true
  } else {
    toggleServiceInCart(service)
  }
}

const toggleServiceInCart = (service: any) => {
  const index = cart.value.findIndex(item => item.service._id === service._id)
  if (index > -1) {
    cart.value.splice(index, 1)
  } else {
    cart.value.push({ service })
  }
}

const removeFromCart = (serviceId: string) => {
  const index = cart.value.findIndex(item => item.service._id === serviceId)
  if (index > -1) {
    cart.value.splice(index, 1)
  }
}

const selectVariant = (variant: any) => {
  selectedVariant.value = variant
}

const addVariantServiceToCart = () => {
  if (selectedServiceForVariant.value) {
    cart.value.push({
      service: selectedServiceForVariant.value,
      selectedVariant: selectedVariant.value
    })
    closeVariantModal()
  }
}

const closeVariantModal = () => {
  showVariantModal.value = false
  selectedServiceForVariant.value = null
  selectedVariant.value = null
}

const proceedToDateTime = () => {
  if (cart.value.length > 0) {
    currentStep.value = 2
  }
}

const previousMonth = () => {
  if (calendarMonth.value === 0) {
    calendarMonth.value = 11
    calendarYear.value--
  } else {
    calendarMonth.value--
  }
}

const nextMonth = () => {
  if (calendarMonth.value === 11) {
    calendarMonth.value = 0
    calendarYear.value++
  } else {
    calendarMonth.value++
  }
}

const selectDate = (date: any) => {
  if (date.isCurrentMonth && date.isAvailable) {
    selectedDate.value = date.dateString
    selectedTime.value = null
    showDatePicker.value = false
    fetchTimeSlots()
  }
}

const selectDateFromQuick = (day: any) => {
  selectedDate.value = day.dateString
  selectedTime.value = null
  fetchTimeSlots()
}

const selectTimeSlot = (time: string) => {
  selectedTime.value = time
}

const fetchTimeSlots = async () => {
  if (!selectedDate.value || !business.value) return
  
  const serviceIds = cart.value.map(item => item.service._id)
  
  await getAvailableSlots({
    subdomain: route.query.subdomain as string,
    date: selectedDate.value,
    serviceIds
  })
}

const proceedToConfirm = () => {
  if (selectedDate.value && selectedTime.value) {
    // Show extra service modal if only 1 service in cart
    if (cart.value.length === 1 && availableExtraServices.value.length > 0) {
      showExtraServiceModal.value = true
    } else {
      checkAuthAndProceed()
    }
  }
}

const addExtraService = (service: any) => {
  // Check if has variants
  if (service.pricingAndDuration.variants && service.pricingAndDuration.variants.length > 0) {
    showExtraServiceModal.value = false
    selectedServiceForVariant.value = service
    selectedVariant.value = null
    showVariantModal.value = true
  } else {
    cart.value.push({ service })
    showExtraServiceModal.value = false
    checkAuthAndProceed()
  }
}

const skipExtraService = () => {
  showExtraServiceModal.value = false
  checkAuthAndProceed()
}

const checkAuthAndProceed = () => {
  checkUserAuthentication()
  if (!isAuthenticated.value) {
    showAuthModal.value = true
  } else {
    currentStep.value = 3
  }
}

const checkUserAuthentication = () => {
  try {
    const userDataStr = localStorage.getItem('user')
    const user = userDataStr ? JSON.parse(userDataStr) : null
    
    if (user && user.id) {
      currentUser.value = user
      isAuthenticated.value = true
    } else {
      isAuthenticated.value = false
    }
  } catch (err) {
    console.error('Error checking authentication:', err)
    isAuthenticated.value = false
  }
}

const handleLogin = async () => {
  try {
    const success = await login({
      email: loginForm.email,
      password: loginForm.password
    })
    
    if (success) {
      checkUserAuthentication()
      showAuthModal.value = false
      currentStep.value = 3
      loginForm.email = ''
      loginForm.password = ''
    }
  } catch (err) {
    console.error('Login error:', err)
  }
}

const handleSignup = async () => {
  try {
    const result = await register({
      firstName: signupForm.firstName,
      lastName: signupForm.lastName,
      email: signupForm.email,
      phone: signupForm.phone,
      password: signupForm.password,
      role: signupForm.role
    })
    
    if (result) {
      const loginSuccess = await login({
        email: signupForm.email,
        password: signupForm.password
      })
      
      if (loginSuccess) {
        checkUserAuthentication()
        showAuthModal.value = false
        currentStep.value = 3
        signupForm.firstName = ''
        signupForm.lastName = ''
        signupForm.email = ''
        signupForm.phone = ''
        signupForm.password = ''
      }
    }
  } catch (err) {
    console.error('Signup error:', err)
  }
}

const confirmBooking = async () => {
  if (!business.value || !selectedDate.value || !selectedTime.value) return
  
  try {
    const payload = {
      businessId: business.value._id,
      clientId: currentUser.value?.id || '507f1f77bcf86cd799439011',
      clientName: `${currentUser.value?.firstName || ''} ${currentUser.value?.lastName || ''}`.trim(),
      clientEmail: currentUser.value?.email || '',
      clientPhone: currentUser.value?.phone || '',
      preferredDate: selectedDate.value,
      preferredStartTime: selectedTime.value,
      services: cart.value.map(item => ({
        serviceId: item.service._id,
        bufferTime: 0
      })),
      bookingSource: {
        sourceType: route.query.source || 'direct_link',
        sourceIdentifier: `BOOKING-WEB-${Date.now()}`,
        channel: 'web',
        ipAddress: 'N/A',
        userAgent: navigator.userAgent
      },
      notes: bookingNotes.value
    }

    const data = await createBooking(payload)
    
    // Initialize payment
    const paymentPayload = {
      email: currentUser.value?.email || '',
      amount: totalPrice.value.amount,
      bookingId: data.bookingId,
      clientId: currentUser.value?.id || 'guest',
      subdomain: route.query.subdomain as string
    }
    
    const paymentRes: any = await initializePayment(paymentPayload)
    
    if (paymentRes && paymentRes.authorization_url) {
      window.location.href = paymentRes.authorization_url
    }
  } catch (err) {
    console.error('Booking error:', err)
  }
}

// Utility functions
const formatPrice = (price: any) => {
  if (!price) return ''
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: price.currency || 'NGN'
  }).format(price.amount || 0)
}

const formatDuration = (duration: any) => {
  if (!duration) return ''
  return `${duration.value} ${duration.unit}`
}

const formatTime = (time: string) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const date = new Date()
  date.setHours(parseInt(hours))
  date.setMinutes(parseInt(minutes))
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const formatDisplayDate = (dateString: string | null) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

// Watch for modal open
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    // Load services when modal opens
    if (route.query.subdomain && (!services.value || services.value.length === 0)) {
      getServices(route.query.subdomain as string)
    }
  }
}, { immediate: true })

// Initialize
onMounted(() => {
  checkUserAuthentication()
})
</script>