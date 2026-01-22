<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-xl font-bold text-gray-900 mb-8">Wallet</h1>

      <div class="bg-white rounded-2xl border-[0.5px] border-gray-100 p-8 mb-6">
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-2">Available Balance</p>
          <p class="text-4xl font-bold text-gray-900 mb-6">₦0.00</p>
          <button class="bg-gray-900 text-white font-semibold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
            Add Funds
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl border-[0.5px] border-gray-100 p-8">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Transaction History</h2>
        
        <div class="text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <p class="text-gray-500">No transactions yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})
</script>