<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b-[0.5px] border-gray-100 z-10 flex-shrink-0 safe-area-top"
      >
        <div
          class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between max-w-7xl mx-auto"
        >
          <button
            v-if="currentStep > 1"
            @click="goBack"
            class="p-2 hover:bg-gray-100 bg-gray-50 rounded-full transition flex-shrink-0 -ml-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div v-else class="w-9 sm:w-10 flex-shrink-0"></div>

          <div class="flex items-center space-x-1 sm:space-x-2 text-sm flex-1 justify-center px-2">
            <span :class="currentStep >= 1 ? 'text-gray-900 font-semibold' : 'text-gray-400'">Services</span>
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span :class="currentStep >= 2 ? 'text-gray-900 font-semibold' : 'text-gray-400'">Details</span>
            <svg class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <span :class="currentStep >= 3 ? 'text-gray-900 font-semibold' : 'text-gray-400'">Review</span>
          </div>

          <button
            @click="close"
            class="p-2 border-[0.5px] border-gray-200 bg-gray-50 rounded-full transition flex-shrink-0 -mr-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-hidden">
        <div class="max-w-7xl mx-auto h-full">
          <div class="lg:grid lg:grid-cols-3 lg:gap-8 lg:p-6 h-full">
            <!-- Left Content - Scrollable -->
            <div ref="leftContentRef" class="lg:col-span-2 p-4 sm:p-6 lg:p-0 pb-[140px] lg:pb-6 h-full overflow-y-auto">
              <!-- ==================== -->
              <!-- STEP 1: Services     -->
              <!-- ==================== -->
              <div v-show="currentStep === 1">
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Select Services
                </h1>
                <!-- {{ show }} -->
                <p class="text-sm sm:text-base text-gray-600 mb-6">
                  Choose the services you'd like for your mobile spa experience
                </p>

                <!-- Sticky Category Tabs -->
                <div v-if="hasServices" class="sticky top-0 bg-white z-10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 pb-4">
                  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                      v-for="category in serviceCategories"
                      :key="category._id || 'featured'"
                      @click="scrollToCategory(category)"
                      :class="[
                        'flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-sm transition',
                        activeCategory === (category._id || 'featured')
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
                      ]"
                    >
                      {{ category.categoryName || "Featured" }}
                    </button>
                  </div>
                </div>


                <!-- Loading -->
                <template v-if="loadingServices">
                  <div class="space-y-4">
                    <div v-for="i in 5" :key="i" class="bg-white border border-gray-100 rounded-xl p-4 animate-pulse">
                      <div class="flex justify-between gap-4">
                        <div class="flex-1 space-y-2">
                          <div class="h-4 w-2/3 bg-gray-100 rounded" />
                          <div class="h-3 w-full bg-gray-100 rounded" />
                          <div class="h-3 w-1/2 bg-gray-100 rounded" />
                        </div>
                        <div class="w-8 h-8 rounded-full bg-gray-100" />
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Empty -->
                <template v-else-if="services.length === 0">
                  <div class="flex flex-col items-center text-center py-16 px-4">
                    <div class="w-16 h-16 rounded-full bg-parentPrimary/10 flex items-center justify-center mb-4">
                      <svg class="w-8 h-8 text-parentPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-1">No services available</h3>
                    <p class="text-sm text-gray-600 max-w-sm">We're currently curating the perfect wellness experiences for you. Please check back shortly 🌿</p>
                  </div>
                </template>

                <!-- Services List -->
                <template v-else>
                  <div ref="servicesContainerRef" class="space-y-8">
                    <div
                      v-for="category in serviceCategories"
                      :key="category._id || 'featured'"
                      :data-category="category._id || 'featured'"
                      :ref="(el) => setCategoryRef(category, el)"
                      class="scroll-mt-32"
                    >
                      <h2 class="text-lg font-bold text-gray-900 mb-1">
                        {{ category?.categoryName ?? "Featured" }}
                      </h2>
                      <p v-if="category?.description" class="text-sm text-gray-500 mb-3">
                        {{ category.description }}
                      </p>

                      <div class="space-y-3">
                        <div
                          v-for="service in getServicesByCategory(category)"
                          :key="service._id"
                          class="bg-white rounded-xl border-[0.5px] transition p-3 sm:p-4 active:scale-98 cursor-pointer"
                          :class="isServiceInCart(service._id) ? 'border-parentPrimary bg-parentPrimary/5' : 'border-gray-100'"
                          @click="handleServiceClick(service)"
                        >
                          <div class="flex items-start justify-between gap-3">
                            <div class="flex-1 min-w-0">
                              <h3 class="font-semibold text-sm sm:text-base mb-1">
                                {{ service.basicDetails.serviceName }}
                              </h3>
                              <p class="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
                                {{ service.basicDetails.description }}
                              </p>
                              <div class="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                                <span>{{ formatDuration(service.pricingAndDuration.duration.servicingTime) }}</span>
                                <span class="font-bold text-gray-900">{{ formatPrice(service.pricingAndDuration.price) }}</span>
                              </div>
                            </div>

                            <!-- Selection toggle -->
                            <button
                              @click.stop="toggleServiceInCart(service)"
                              class="ml-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition flex-shrink-0"
                              :class="isServiceInCart(service._id) ? 'bg-parentPrimary text-white' : 'border-[0.5px] border-gray-100'"
                            >
                              <svg v-if="isServiceInCart(service._id)" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                              </svg>
                              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256">
                                <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                              </svg>
                            </button>
                          </div>

                          <!-- Quantity stepper (visible when selected) -->
                          <!-- <div v-if="isServiceInCart(service._id)" class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <span class="text-sm text-gray-600">How many?</span>
                            <div class="flex items-center gap-3">
                              <button
                                @click="decrementQty(service._id)"
                                class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition text-gray-700"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                </svg>
                              </button>
                              <span class="text-base font-bold w-8 text-center">{{ getQty(service._id) }}</span>
                              <button
                                @click="incrementQty(service._id)"
                                class="w-8 h-8 rounded-full bg-parentPrimary/10 hover:bg-parentPrimary/20 flex items-center justify-center transition text-parentPrimary"
                              >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                          </div> -->
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>

              <!-- ==================== -->
              <!-- STEP 2: Details      -->
              <!-- ==================== -->
              <div v-show="currentStep === 2">
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Booking Details
                </h1>
                <p class="text-sm sm:text-base text-gray-600 mb-6">
                  Tell us about your event and location
                </p>

                <div class="space-y-1">
                  <!-- Number of People -->
                  <UiAnimatedInput
                    v-model="numberOfPeople"
                    label="Number of People"
                    type="number"
                    :hasError="numberOfPeopleError"
                    :errorMessage="numberOfPeopleError ? 'At least 1 person required' : ''"
                  />

                  <!-- Location -->
                  <div class="mb-2">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div class="relative">
                      <UiGooglePlacesAutocomplete
                        v-model="location"
                        :apiKey="googleApiKey"
                        placeholder="Search for your address..."
                      />
                    </div>
                  </div>

                  <!-- Additional Directions -->
                  <UiAnimatedInput
                    v-model="additionalDirections"
                    label="Additional Directions (optional)"
                    type="textarea"
                    :rows="2"
                  />

                  <!-- Date -->
                  <UiAnimatedInput
                    v-model="requestedDate"
                    label="Preferred Date"
                    type="date"
                  />

                  <!-- Time -->
                  <UiAnimatedInput
                    v-model="requestedTime"
                    label="Preferred Time (optional)"
                    type="time"
                  />

                  <!-- Notes -->
                  <UiAnimatedInput
                    v-model="clientNotes"
                    label="Special Requests / Notes (optional)"
                    type="textarea"
                    :rows="3"
                  />
                </div>
              </div>

              <!-- ==================== -->
              <!-- STEP 3: Review       -->
              <!-- ==================== -->
              <div v-show="currentStep === 3" class="space-y-4">
                <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  Review & Submit
                </h1>
                <p class="text-sm text-gray-600 mb-4">
                  Please review your mobile spa request
                </p>

                <!-- Selected Services -->
                <div class="bg-gray-50 rounded-xl p-4">
                  <h3 class="font-semibold text-sm mb-3 text-gray-700 uppercase tracking-wide">Services</h3>
                  <div class="space-y-3">
                    <div
                      v-for="item in selectedItems"
                      :key="item.service._id"
                      class="flex items-center justify-between bg-white rounded-lg p-3"
                    >
                      <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-sm">{{ item.service.basicDetails.serviceName }}</h4>
                        <p class="text-xs text-gray-500" v-if="item.selectedVariant">
                           {{ item.selectedVariant.variantName }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ formatDuration(item.selectedVariant?.pricing?.duration || item.service.pricingAndDuration.duration.servicingTime) }}
                          <span v-if="item.quantity > 1" class="ml-1 text-parentPrimary font-semibold">× {{ item.quantity }}</span>
                        </p>
                      </div>
                      <span class="font-bold text-sm">
                        {{ formatPrice({ amount: (item.selectedVariant?.pricing?.price?.amount || item.service.pricingAndDuration.price.amount) * item.quantity, currency: item.selectedVariant?.pricing?.price?.currency || item.service.pricingAndDuration.price.currency }) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Details -->
                <div class="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h3 class="font-semibold text-sm text-gray-700 uppercase tracking-wide">Details</h3>

                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-parentPrimary/10 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-parentPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Number of People</p>
                      <p class="font-medium text-sm">{{ numberOfPeople || 'Not specified' }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-parentPrimary/10 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-parentPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-gray-500">Location</p>
                      <p class="font-medium text-sm truncate">{{ location?.address || 'Not selected' }}</p>
                      <p v-if="additionalDirections" class="text-xs text-gray-500 mt-0.5">{{ additionalDirections }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-parentPrimary/10 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-parentPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Date & Time</p>
                      <p class="font-medium text-sm">
                        {{ requestedDate ? formatDisplayDate(requestedDate) : 'Not selected' }}
                        <span v-if="requestedTime" class="text-gray-500">at {{ requestedTime }}</span>
                      </p>
                    </div>
                  </div>

                  <div v-if="clientNotes" class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg bg-parentPrimary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-4 h-4 text-parentPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500">Notes</p>
                      <p class="font-medium text-sm">{{ clientNotes }}</p>
                    </div>
                  </div>
                </div>

                <!-- Error message -->
                <div v-if="submitError" class="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                  {{ submitError }}
                </div>

                <!-- Success message -->
                <div v-if="submitSuccess" class="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="font-semibold text-green-800">Request Submitted!</h4>
                      <p class="text-sm text-green-700">Your mobile spa request has been sent. We'll get back to you shortly.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop Sidebar -->
            <div class="hidden lg:block lg:col-span-1">
              <div class="sticky top-24 bg-white border-[0.5px] border-gray-50 rounded-lg h-[calc(100vh-12rem)] flex flex-col">
                <!-- Title -->
                <div class="flex items-center gap-3 p-6 pb-4 border-b-[0.5px] border-gray-50 flex-shrink-0">
                  <div class="w-12 h-12 rounded-lg bg-parentPrimary/10 flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-parentPrimary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a2 2 0 012-2h2a2 2 0 012 2m-6 0h6" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-sm">Mobile Spa</h3>
                    <p class="text-xs text-gray-500">We come to you</p>
                  </div>
                </div>

                <!-- Cart Content -->
                <div class="flex-1 overflow-y-auto px-6 py-4">
                  <div v-if="selectedItems.length === 0" class="text-center py-8">
                    <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <p class="text-sm text-gray-500">No services selected</p>
                  </div>

                  <div v-else class="space-y-3">
                    <div v-if="requestedDate" class="text-sm space-y-1 pb-3 border-b-[0.5px] border-gray-50">
                      <div class="flex items-center gap-2 text-gray-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span class="text-xs">{{ formatDisplayDate(requestedDate) }}</span>
                      </div>
                      <div v-if="requestedTime" class="flex items-center gap-2 text-gray-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-xs">{{ requestedTime }}</span>
                      </div>
                    </div>

                    <div
                      v-for="item in selectedItems"
                      :key="item.service._id"
                      class="border-t-[0.5px] first:border-t-0 border-gray-50 pt-3"
                    >
                      <div class="flex justify-between items-start mb-1">
                        <h4 class="font-medium text-sm flex-1">{{ item.service.basicDetails.serviceName }}</h4>
                        <button @click="removeService(item.service._id)" class="text-gray-400 bg-gray-50 rounded-full p-1 hover:text-red-500 ml-2 flex-shrink-0">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div class="text-xs text-blue-500 font-medium mb-1" v-if="item.selectedVariant">
                        {{ item.selectedVariant.variantName }}
                      </div>
                      <div class="text-xs text-gray-500 mb-1">
                        {{ formatDuration(item.selectedVariant?.pricing?.duration || item.service.pricingAndDuration.duration.servicingTime) }}
                        <span v-if="item.quantity > 1"> × {{ item.quantity }}</span>
                      </div>
                      <div class="font-semibold text-sm">
                        {{ formatPrice({ amount: (item.selectedVariant?.pricing?.price?.amount || item.service.pricingAndDuration.price.amount) * item.quantity, currency: item.selectedVariant?.pricing?.price?.currency || item.service.pricingAndDuration.price.currency }) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Total & CTA -->
                <div v-if="selectedItems.length > 0" class="border-t-[0.5px] border-gray-100 p-6 flex-shrink-0">
                  <div class="flex justify-between items-center mb-4">
                    <span class="font-semibold text-base">Total</span>
                    <span class="font-semibold text-base">{{ formatPrice(totalPrice) }}</span>
                  </div>

                  <button
                    v-if="currentStep === 1"
                    @click="goToStep2"
                    :disabled="selectedItems.length === 0"
                    class="w-full bg-gray-900 text-white text-sm font-bold py-3.5 rounded-full transition disabled:opacity-50 hover:bg-gray-800"
                  >
                    Continue
                  </button>
                  <button
                    v-else-if="currentStep === 2"
                    @click="goToStep3"
                    :disabled="!canProceedToReview"
                    class="w-full bg-gray-900 text-white text-sm font-bold py-3.5 rounded-full transition disabled:opacity-50 hover:bg-gray-800"
                  >
                    Continue
                  </button>
                  <button
                    v-else-if="currentStep === 3"
                    @click="checkAuthAndSubmit"
                    :disabled="submitting || submitSuccess"
                    class="w-full bg-gray-900 text-white text-sm font-bold py-3.5 rounded-full transition disabled:opacity-50 hover:bg-gray-800"
                  >
                    {{ submitting ? 'Submitting...' : 'Submit Request' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Bottom Bar -->
      <div class="lg:hidden pointer-events-none" style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 99999;">
        <div class="flex justify-center w-full pb-6">
          <div
            v-if="selectedItems.length > 0"
            class="flex items-center gap-3 bg-white rounded-full shadow-xl px-4 py-2 pointer-events-auto border border-gray-100"
            style="max-width: 95vw; min-width: 0;"
          >
            <div class="flex flex-col items-start min-w-0 pr-2">
              <div class="text-xs text-gray-600">
                {{ selectedItems.length }} service{{ selectedItems.length > 1 ? 's' : '' }}
              </div>
              <div class="font-bold text-lg truncate">
                {{ formatPrice(totalPrice) }}
              </div>
            </div>
            <button
              v-if="currentStep === 1"
              @click="goToStep2"
              :disabled="selectedItems.length === 0"
              class="px-6 py-3 bg-gray-900 text-white font-semibold rounded-full transition disabled:opacity-50 text-sm whitespace-nowrap min-w-[120px] pointer-events-auto shadow-lg"
            >
              Continue
            </button>
            <button
              v-else-if="currentStep === 2"
              @click="goToStep3"
              :disabled="!canProceedToReview"
              class="px-6 py-3 bg-gray-900 text-white font-semibold rounded-full transition disabled:opacity-50 text-sm whitespace-nowrap min-w-[120px] pointer-events-auto shadow-lg"
            >
              Continue
            </button>
            <button
              v-else-if="currentStep === 3"
              @click="checkAuthAndSubmit"
              :disabled="submitting || submitSuccess"
              class="px-6 py-3 bg-gray-900 text-white font-semibold rounded-full transition disabled:opacity-50 text-sm whitespace-nowrap min-w-[120px] pointer-events-auto shadow-lg"
            >
              {{ submitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
          <div v-else class="text-center text-sm text-gray-500 py-2 bg-white rounded-full shadow-xl px-4 pointer-events-auto border border-gray-100">
            No services selected
          </div>
        </div>
      </div>
    </div>

    <!-- Service Details Modal -->
    <Teleport to="body" v-if="showServiceDetailsModal && selectedServiceForDetails">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          <!-- Header -->
          <div class="p-6 border-b-[0.5px] border-gray-100 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ selectedServiceForDetails.basicDetails.serviceName }}</h2>
              <p class="text-sm text-gray-500 mt-1">Configure your service</p>
            </div>
            <button @click="closeServiceDetailsModal" class="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <p class="text-gray-600 text-sm mb-8 leading-relaxed">
              {{ selectedServiceForDetails.basicDetails.description }}
            </p>

            <!-- Variants Selection -->
            <div v-if="selectedServiceForDetails.variants?.length > 0">
              <h3 class="font-semibold mb-4 text-xs uppercase tracking-widest text-gray-400">Select an option *</h3>
              <div class="space-y-3">
                <div
                  v-for="variant in selectedServiceForDetails.variants"
                  :key="variant.variantName"
                  @click="selectedVariant = variant"
                  :class="[
                    'p-4 border-[0.5px] rounded-2xl cursor-pointer transition relative group',
                    selectedVariant?.variantName === variant.variantName
                      ? 'border-parentPrimary bg-parentPrimary/5 ring-1 ring-parentPrimary/20'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50',
                  ]"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1 pr-4">
                      <h4 class="font-bold text-sm text-gray-900 group-hover:text-parentPrimary transition-colors">{{ variant.variantName }}</h4>
                      <p v-if="variant.variantDescription" class="text-xs text-gray-500 mt-1 line-clamp-2">{{ variant.variantDescription }}</p>
                      <div class="mt-3 flex items-center gap-2">
                        <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {{ formatDuration(variant.pricing.duration) }}
                        </span>
                      </div>
                    </div>
                    <div class="flex flex-col items-end gap-3">
                      <span class="font-bold text-sm text-gray-900">{{ formatPrice(variant.pricing.price) }}</span>
                      <div
                        :class="[
                          'w-5 h-5 rounded-full border-[0.5px] flex items-center justify-center transition-all',
                          selectedVariant?.variantName === variant.variantName
                            ? 'border-parentPrimary bg-parentPrimary scale-110 shadow-lg shadow-parentPrimary/30'
                            : 'border-gray-200 bg-white group-hover:border-gray-300',
                        ]"
                      >
                        <svg v-if="selectedVariant?.variantName === variant.variantName" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Simple quantity if no variants -->
            <div v-else class="py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
               <span class="text-sm font-bold text-gray-900">{{ formatPrice(selectedServiceForDetails.pricingAndDuration.price) }}</span>
               <p class="text-xs text-gray-500 mt-1">{{ formatDuration(selectedServiceForDetails.pricingAndDuration.duration.servicingTime) }}</p>
            </div>

            <!-- Shared Quantity Stepper -->
            <div class="mt-8 pt-8 border-t-[0.5px] border-gray-100 flex items-center justify-between">
              <div>
                <span class="font-bold text-sm text-gray-900">Quantity</span>
                <p class="text-[10px] text-gray-500">How many people?</p>
              </div>
              <div class="flex items-center gap-4">
                <button
                  @click="detailsQuantity > 1 ? detailsQuantity-- : null"
                  :disabled="detailsQuantity <= 1"
                  class="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  <svg class="w-5 h-5 text-gray-600 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <span class="text-xl font-black w-8 text-center text-gray-900">{{ detailsQuantity }}</span>
                <button
                  @click="detailsQuantity++"
                  class="w-10 h-10 rounded-xl bg-parentPrimary/10 hover:bg-parentPrimary/20 flex items-center justify-center transition group"
                >
                  <svg class="w-5 h-5 text-parentPrimary group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 border-t-[0.5px] border-gray-100 flex-shrink-0 bg-gray-50/50">
            <div class="flex items-center justify-between mb-6">
              <div>
                <p class="text-[10px] uppercase font-bold tracking-widest text-gray-400">Estimated Total</p>
                <p class="text-2xl font-black text-gray-900">
                  {{
                    formatPrice({
                      amount: (selectedVariant ? selectedVariant.pricing.price.amount : selectedServiceForDetails.pricingAndDuration.price.amount) * detailsQuantity,
                      currency: selectedVariant ? selectedVariant.pricing.price.currency : selectedServiceForDetails.pricingAndDuration.price.currency
                    })
                  }}
                </p>
              </div>
            </div>
            <button
              @click="addServiceToCart"
              :disabled="!selectedVariant && selectedServiceForDetails.variants?.length > 0"
              class="w-full bg-gray-900 text-white font-black py-4 rounded-2xl transition shadow-xl shadow-gray-200 hover:bg-gray-800 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Add to Booking
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Auth Modal -->
    <Teleport to="body" v-if="showAuthModal">
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
      >
        <div class="bg-white rounded-2xl max-w-md w-full">
          <div class="p-6">
            <div class="pb-4">
              <h2 class="text-xl font-bold mb-1">Log in or sign up</h2>
              <p class="text-gray-600 text-sm mb-6">
                Log in or sign up to submit your mobile spa request
              </p>
            </div>

            <!-- Tab Navigation -->
            <div class="flex gap-4 mb-6 border-b-[0.5px] border-gray-100">
              <button
                @click="authTab = 'login'"
                :class="[
                  'pb-2 w-full font-semibold transition',
                  authTab === 'login'
                    ? 'text-parentPrimary border-b-2 border-parentPrimary'
                    : 'text-gray-600 hover:text-gray-800',
                ]"
              >
                Login
              </button>
              <button
                @click="authTab = 'signup'"
                :class="[
                  'pb-2 w-full font-semibold transition',
                  authTab === 'signup'
                    ? 'text-parentPrimary border-b-2 border-parentPrimary'
                    : 'text-gray-600 hover:text-gray-800',
                ]"
              >
                Sign Up
              </button>
            </div>

            <!-- Login Form -->
            <form
              v-if="authTab === 'login'"
              @submit.prevent="handleLogin"
              class="space-y-4"
            >
              <div>
                <UiAnimatedInput
                  v-model="loginForm.email"
                  type="email"
                  label="Email"
                  required
                />
              </div>
              <div>
                <UiAnimatedInput
                  v-model="loginForm.password"
                  type="password"
                  label="Password"
                  required
                />
              </div>
              <div v-if="loginError" class="text-red-500 text-sm">
                {{ loginError }}
              </div>
              <div class="pt-6">
                <button
                  type="submit"
                  class="w-full bg-parentPrimary text-sm text-white font-bold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-parentPrimary/90"
                >
                  Continue
                </button>
              </div>
            </form>

            <!-- Signup Form -->
            <form v-else @submit.prevent="handleSignup" class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <UiAnimatedInput
                    v-model="signupForm.firstName"
                    type="text"
                    label="First Name"
                    required
                  />
                </div>
                <div>
                  <UiAnimatedInput
                    v-model="signupForm.lastName"
                    label="Last Name"
                    type="text"
                    required
                  />
                </div>
              </div>
              <div>
                <UiAnimatedInput
                  v-model="signupForm.email"
                  type="email"
                  required
                  label="Email"
                />
              </div>
              <div>
                <UiAnimatedInput
                  v-model="signupForm.phone"
                  type="tel"
                  label="Phone Number"
                />
              </div>
              <div>
                <UiAnimatedInput
                  v-model="signupForm.password"
                  type="password"
                  label="Password"
                  required
                  minlength="6"
                />
                <p class="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
              </div>
              <div v-if="signupError" class="text-red-500 text-sm">
                {{ signupError }}
              </div>
              <div class="pt-6">
                <button
                  type="submit"
                  class="w-full bg-parentPrimary text-sm text-white font-bold py-3 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-parentPrimary/90"
                >
                  Continue
                </button>
              </div>
            </form>

            <!-- Divider -->
            <div class="relative my-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <!-- Google Sign In -->
            <button
              type="button"
              @click="handleGoogleAuth"
              :disabled="googleAuthLoading"
              class="w-full disabled:cursor-not-allowed disabled:opacity-25 flex items-center justify-center gap-3 bg-white border-[0.5px] border-gray-100 hover:border-gray-100 text-gray-700 font-semibold py-3 rounded-full transition-all"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {{ googleAuthLoading ? 'processing..' : 'Continue with Google' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { useMobileSpa } from '@/composables/useMobileSpa'

import { useGetServices } from '@/composables/modules/services/useGetServices'
import { useGetBusiness } from '@/composables/modules/business/useGetBusiness'
import { useLogin } from '@/composables/modules/auth/useLogin'
import { useRegister } from '@/composables/modules/auth/useRegister'
import { useGoogleAuth } from '@/composables/modules/auth/useGoogleAuth'
import GooglePlacesAutocomplete from '@/components/ui/GooglePlacesAutocomplete.vue'

const props = defineProps<{
  show: boolean
  googleApiKey: string
}>()
const emit = defineEmits(['close', 'submitted'])

// Composables
const { services, getServices, loading: loadingServices } = useGetServices()
const { business } = useGetBusiness()
const { createMobileSpa, loading: submitting, error: submitError, success: submitSuccess, reset: resetMobileSpa } = useMobileSpa()
const { login, error: loginError } = useLogin()
const { register, error: signupError } = useRegister()
const { loginWithGoogle, loading: googleAuthLoading } = useGoogleAuth()
const { trackEvent } = useAnalytics()


// State
const currentStep = ref(1)
const cart = ref<Array<{ service: any; selectedVariant?: any; quantity: number }>>([])
const numberOfPeople = ref<string | number>(1)
const location = ref<any>(null)
const additionalDirections = ref('')
const requestedDate = ref('')
const requestedTime = ref('')
const clientNotes = ref('')

// Service details modal state
const showServiceDetailsModal = ref(false)
const selectedServiceForDetails = ref<any>(null)
const selectedVariant = ref<any>(null)
const detailsQuantity = ref(1)

// Category scrolling state
const categoryRefs = ref<Record<string, HTMLElement>>({});
const servicesContainerRef = ref<HTMLElement | null>(null);
const leftContentRef = ref<HTMLElement | null>(null);
const scrollObserver = ref<IntersectionObserver | null>(null);
const isUserScrolling = ref(false);
const activeCategory = ref('featured');
let scrollTimeout: any = null;


// Auth state
const showAuthModal = ref(false)
const authTab = ref<'login' | 'signup'>('login')
const isAuthenticated = ref(false)
const currentUser = ref<any>(null)

// Auth forms
const loginForm = reactive({
  email: '',
  password: '',
})

const signupForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: 'client',
})

// Validation
const numberOfPeopleError = ref(false)

// Computed
const selectedItems = computed(() => {
  return cart.value
})

const totalPrice = computed(() => {
  let total = { amount: 0, currency: 'NGN' }
  cart.value.forEach(item => {
    const price = item.selectedVariant ? item.selectedVariant.pricing.price : item.service.pricingAndDuration.price
    total.amount += (price.amount || 0) * (item.quantity || 1)
    total.currency = price.currency || 'NGN'
  })
  return total
})

const canProceedToReview = computed(() => {
  const numPeople = Number(numberOfPeople.value)
  return numPeople >= 1 && location.value && requestedDate.value
})

// const serviceCategories = computed(() => {
//   const categoriesMap = new Map();

//   // Add "Featured" category first
//   categoriesMap.set('featured', { _id: null, categoryName: 'Featured' });

//   services.value?.forEach((service: any) => {
//     if (service.basicDetails.category && service.basicDetails.category._id) {
//       categoriesMap.set(service.basicDetails.category._id, service.basicDetails.category);
//     }
//   });

//   return Array.from(categoriesMap.values());
// });

const serviceCategories = computed(() => {
  const categoriesMap = new Map();
  categoriesMap.set('featured', { _id: null, categoryName: 'Featured' });

  services.value?.forEach((service: any) => {
    const cat = service.basicDetails.category;
    if (cat?._id && !categoriesMap.has(cat._id)) {
      categoriesMap.set(cat._id, {
        ...cat,
        description: service.basicDetails.description || ''  // 👈 grab from first service in category
      });
    }
  });

  return Array.from(categoriesMap.values());
});

const hasServices = computed(() => serviceCategories.value.length > 0);

const getServicesByCategory = (category: any) => {
  if (!category._id || category.categoryName === "Featured") {
    return services.value;
  }
  return (
    services.value?.filter((s: any) => s.basicDetails.category?._id === category._id) ||
    []
  );
};


// Methods
function isServiceInCart(serviceId: string) {
  return cart.value.some(item => item.service._id === serviceId)
}

function handleServiceClick(service: any) {
  selectedServiceForDetails.value = service
  selectedVariant.value = null
  detailsQuantity.value = 1
  showServiceDetailsModal.value = true
}

function toggleServiceInCart(service: any) {
  const index = cart.value.findIndex(item => item.service._id === service._id)
  if (index > -1) {
    cart.value.splice(index, 1)
  } else {
    handleServiceClick(service)
  }
}

function removeService(serviceId: string) {
  const index = cart.value.findIndex(item => item.service._id === serviceId)
  if (index > -1) {
    cart.value.splice(index, 1)
  }
}

function addServiceToCart() {
  if (selectedServiceForDetails.value) {
    // If already in cart, remove it first (to update it)
    const index = cart.value.findIndex(item => item.service._id === selectedServiceForDetails.value._id)
    if (index > -1) {
      cart.value.splice(index, 1)
    }
    
    cart.value.push({
      service: selectedServiceForDetails.value,
      selectedVariant: selectedVariant.value,
      quantity: detailsQuantity.value
    })
    closeServiceDetailsModal()
  }
}

function closeServiceDetailsModal() {
  trackEvent('click', 'Mobile Spa Modal', 'close_service_details')
  showServiceDetailsModal.value = false
  selectedServiceForDetails.value = null
  selectedVariant.value = null
  detailsQuantity.value = 1
}


function goBack() {
  if (currentStep.value > 1) currentStep.value--
}

function goToStep2() {
  if (selectedItems.value.length > 0) currentStep.value = 2
}

function goToStep3() {
  trackEvent('booking_intent', 'Mobile Spa Modal', 'proceed_to_review', {
    itemsCount: selectedItems.value.length,
    totalPrice: totalPrice.value.amount
  })
  currentStep.value = 3
}


const setCategoryRef = (category: any, el: any) => {
  const key = category._id || 'featured';
  if (el) {
    categoryRefs.value[key] = el;
  } else {
    delete categoryRefs.value[key];
  }
};

const setupScrollObserver = () => {
  if (scrollObserver.value) {
    scrollObserver.value.disconnect();
  }

  const observerOptions = {
    root: leftContentRef.value,
    threshold: [0, 0.1],
    rootMargin: "-10% 0px -80% 0px",
  };


  scrollObserver.value = new IntersectionObserver((entries) => {
    if (isUserScrolling.value) return;

    let maxRatio = 0;
    let visibleCategory = activeCategory.value;

    entries.forEach((entry) => {
      if (entry.intersectionRatio > maxRatio) {
        maxRatio = entry.intersectionRatio;
        const category = entry.target.getAttribute("data-category");
        if (category) {
          visibleCategory = category;
        }
      }
    });

    if (maxRatio > 0) {
      activeCategory.value = visibleCategory;
    }
  }, observerOptions);

  Object.values(categoryRefs.value).forEach((ref) => {
    if (ref) {
      scrollObserver.value?.observe(ref);
    }
  });

  // Track manual scrolling
  if (leftContentRef.value) {
    leftContentRef.value.addEventListener("scroll", handleScroll);
  }
};

const handleScroll = () => {
  isUserScrolling.value = true;

  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(() => {
    isUserScrolling.value = false;
  }, 150);
};

const scrollToCategory = (category: any) => {
  const key = category._id || 'featured';
  const element = categoryRefs.value[key];
  
  if (element) {
    isUserScrolling.value = true;
    activeCategory.value = key;

    if (leftContentRef.value) {
      const offset = 20; 
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - offset;

      leftContentRef.value.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }
};

onMounted(() => {
  if (props.show) {
    nextTick(() => {
      setupScrollObserver();
    });
  }
});

watch(() => props.show, (val) => {
    if (val) {
        trackEvent('click', 'Mobile Spa Modal', 'open_modal')
        nextTick(() => {
            setupScrollObserver();
        })
    }
});


// Auth helpers
function checkUserAuthentication() {
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

function checkAuthAndSubmit() {
  checkUserAuthentication()
  if (!isAuthenticated.value) {
    showAuthModal.value = true
  } else {
    submitRequest()
  }
}

const handleLogin = async () => {
  try {
    const success = await login({
      email: loginForm.email,
      password: loginForm.password,
    })

    if (success) {
      checkUserAuthentication()
      showAuthModal.value = false
      loginForm.email = ''
      loginForm.password = ''
      submitRequest()
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
      role: signupForm.role,
    })

    if (result) {
      const loginSuccess = await login({
        email: signupForm.email,
        password: signupForm.password,
      })

      if (loginSuccess) {
        checkUserAuthentication()
        showAuthModal.value = false
        signupForm.firstName = ''
        signupForm.lastName = ''
        signupForm.email = ''
        signupForm.phone = ''
        signupForm.password = ''
        submitRequest()
      }
    }
  } catch (err) {
    console.error('Signup error:', err)
  }
}

const handleGoogleAuth = async () => {
  await loginWithGoogle().then((response: any) => {
    if (response?.data?.success) {
      checkUserAuthentication()
      showAuthModal.value = false
      submitRequest()
    }
  })
}

async function submitRequest() {
  if (submitting.value || submitSuccess.value) return
  if (!business.value?._id) return

  const payload = {
    businessId: business.value._id,
    services: selectedItems.value.map(item => ({
      serviceId: item.service._id,
      variantId: item.selectedVariant?._id,
      quantity: item.quantity
    })),
    numberOfPeople: Number(numberOfPeople.value),
    location: {
      address: location.value.address,
      lat: location.value.lat || 0,
      lng: location.value.lng || 0,
      placeId: location.value.placeId || '',
      additionalDirections: additionalDirections.value
    },
    requestedDate: requestedDate.value,
    requestedTime: requestedTime.value || undefined,
    clientNotes: clientNotes.value || undefined
  }

  await createMobileSpa(payload)

  if (submitSuccess.value) {
    trackEvent('form_submit', 'Mobile Spa Modal', 'submit_success', {
      items: selectedItems.value.map(i => i.service.basicDetails.serviceName),
      total: totalPrice.value.amount
    })
    emit('submitted')
    // Auto close after delay
    setTimeout(() => {
      close()
    }, 3000)
  } else {
    trackEvent('form_submit', 'Mobile Spa Modal', 'submit_failed', {
      error: submitError.value || 'Unknown error'
    })
  }
}


function close() {
  trackEvent('click', 'Mobile Spa Modal', 'close_modal')
  resetForm()
  emit('close')
}


function resetForm() {
  currentStep.value = 1
  cart.value = []
  numberOfPeople.value = 1
  location.value = null
  additionalDirections.value = ''
  requestedDate.value = ''
  requestedTime.value = ''
  clientNotes.value = ''
  numberOfPeopleError.value = false
  resetMobileSpa()
}

// Fetch services when modal opens
watch(() => props.show, async (val) => {
  console.log('Modal show changed:', val)
  if (val) {
    resetForm()
    if (services.value.length === 0) {
      await getServices('lola-beauty')
    }
  }
}, { immediate: true  })

// Utility functions
function formatPrice(price: any) {
  if (!price) return ''
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: price.currency || 'NGN',
    minimumFractionDigits: 0,
  }).format(price.amount)
}

function formatDuration(duration: any) {
  if (!duration) return ''
  if (duration.unit === 'h') return `${duration.value}hr${duration.value > 1 ? 's' : ''}`
  return `${duration.value} min`
}

function formatDisplayDate(dateStr: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<style scoped>
.safe-area-top {
  padding-top: env(safe-area-inset-top, 0);
}
</style>
