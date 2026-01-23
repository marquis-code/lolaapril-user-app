<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Wallet</h1>

      <!-- Balance Card -->
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 mb-6 shadow-lg">
        <div class="text-center">
          <p class="text-sm text-gray-300 mb-2">Available Balance</p>
          <p class="text-3xl sm:text-4xl font-bold text-white mb-6">₦{{ formatAmount(totalBalance) }}</p>
          <button
            class="bg-white text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Add Funds
          </button>
        </div>
      </div>

      <!-- {{ transactions }} -->

      <!-- Transactions -->
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="p-4 sm:p-6 border-b border-gray-100">
          <h2 class="text-lg font-bold text-gray-900">Transaction History</h2>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-4 sm:p-6 space-y-4">
          <div v-for="i in 5" :key="i" class="h-16 bg-gray-100 rounded-lg animate-pulse" />
        </div>

        <!-- Empty State -->
        <div v-else-if="!sortedTransactions.length" class="text-center py-16 px-4">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <p class="text-gray-600 font-medium mb-1">No transactions yet</p>
          <p class="text-gray-500 text-sm">Your transaction history will appear here</p>
        </div>

        <!-- Mobile View - Cards -->
        <!-- <div v-else class="block sm:hidden">
          <div class="divide-y divide-gray-100">
            <div
              v-for="transaction in paginatedTransactions"
              :key="transaction._id"
              @click="selectTransaction(transaction)"
              class="p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 text-sm truncate">
                    {{ transaction.businessId?.businessName || 'Unknown Business' }}
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ transaction.items[0]?.itemName || 'Payment' }}
                  </p>
                </div>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0"
                  :class="statusClasses(transaction.status)"
                >
                  {{ transaction.status }}
                </span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">
                  {{ formatDate(transaction.paidAt || transaction.createdAt) }}
                </span>
                <span class="font-bold text-gray-900">
                  ₦{{ formatAmount(transaction.totalAmount) }}
                </span>
              </div>
            </div>
          </div>
        </div> -->

        <!-- Desktop View - Table -->
        <div v-else class="hidden sm:block overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-25">
                <th class="px-6 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th class="px-6 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Business</th>
                <th class="px-6 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th class="px-6 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="transaction in paginatedTransactions"
                :key="transaction._id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {{ formatDate(transaction.paidAt || transaction.createdAt) }}
                </td>

                <td class="px-6 py-4">
                  <p class="font-medium text-gray-900 truncate max-w-xs">
                    {{ transaction.businessId?.businessName || 'Unknown Business' }}
                  </p>
                </td>

                <td class="px-6 py-4">
                  <p class="text-gray-600 truncate max-w-xs">
                    {{ transaction.items[0]?.itemName || 'Payment' }}
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    Ref: {{ transaction.paymentReference }}
                  </p>
                </td>

                <td class="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                  ₦{{ formatAmount(transaction.totalAmount) }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="statusClasses(transaction.status)"
                  >
                    {{ transaction.status }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="selectTransaction(transaction)"
                    class="text-primary hover:text-primary-700 font-medium text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="p-4 sm:p-6 border-t border-gray-100 flex items-center justify-between">
          <div class="text-sm text-gray-600">
            Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, sortedTransactions.length) }} of {{ sortedTransactions.length }} transactions
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div class="hidden sm:flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                :class="[
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <span class="sm:hidden text-sm text-gray-600">
              {{ currentPage }} / {{ totalPages }}
            </span>

            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Detail Modal -->
    <Teleport to="body">
      <div
        v-if="selectedTransaction"
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-2xl flex items-end sm:items-center justify-center z-50 p-4"
        @click.self="selectedTransaction = null"
      >
        <div class="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900">Transaction Details</h2>
            <button
              @click="selectedTransaction = null"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-6">
            <!-- Status Badge -->
            <div class="text-center">
              <span
                class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
                :class="statusClasses(selectedTransaction.status)"
              >
                {{ selectedTransaction.status.toUpperCase() }}
              </span>
            </div>

            <!-- Amount -->
            <div class="text-center">
              <p class="text-sm text-gray-600 mb-1">Amount Paid</p>
              <p class="text-3xl font-bold text-gray-900">
                ₦{{ formatAmount(selectedTransaction.totalAmount) }}
              </p>
            </div>

            <!-- Transaction Info -->
            <div class="space-y-4 border-t border-gray-100 pt-6">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Business</span>
                <span class="text-sm font-semibold text-gray-900 text-right">
                  {{ selectedTransaction.businessId?.businessName || 'Unknown Business' }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Reference</span>
                <span class="text-sm font-mono text-gray-900">
                  {{ selectedTransaction.paymentReference }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Date</span>
                <span class="text-sm text-gray-900">
                  {{ formatFullDate(selectedTransaction.paidAt || selectedTransaction.createdAt) }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Payment Method</span>
                <span class="text-sm text-gray-900 capitalize">
                  {{ selectedTransaction.paymentMethod }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Gateway</span>
                <span class="text-sm text-gray-900 capitalize">
                  {{ selectedTransaction.gateway }}
                </span>
              </div>
            </div>

            <!-- Items -->
            <div class="border-t border-gray-100 pt-6">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Items</h3>
              <div class="space-y-3">
                <div
                  v-for="(item, index) in selectedTransaction.items"
                  :key="index"
                  class="flex justify-between items-start"
                >
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ item.itemName }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">
                      Qty: {{ item.quantity }} × ₦{{ formatAmount(item.unitPrice) }}
                    </p>
                  </div>
                  <p class="text-sm font-semibold text-gray-900">
                    ₦{{ formatAmount(item.totalPrice) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Amount Breakdown -->
            <div class="border-t border-gray-100 pt-6 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="text-gray-900">₦{{ formatAmount(selectedTransaction.subtotal) }}</span>
              </div>

              <div v-if="selectedTransaction.totalTax > 0" class="flex justify-between text-sm">
                <span class="text-gray-600">Tax</span>
                <span class="text-gray-900">₦{{ formatAmount(selectedTransaction.totalTax) }}</span>
              </div>

              <div v-if="selectedTransaction.totalDiscount > 0" class="flex justify-between text-sm">
                <span class="text-gray-600">Discount</span>
                <span class="text-green-600">-₦{{ formatAmount(selectedTransaction.totalDiscount) }}</span>
              </div>

              <div class="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                <span class="text-gray-900">Total</span>
                <span class="text-gray-900">₦{{ formatAmount(selectedTransaction.totalAmount) }}</span>
              </div>

              <div v-if="selectedTransaction.refundedAmount > 0" class="flex justify-between text-sm">
                <span class="text-gray-600">Refunded</span>
                <span class="text-red-600">-₦{{ formatAmount(selectedTransaction.refundedAmount) }}</span>
              </div>
            </div>

            <!-- Platform Fee (if available) -->
            <div
              v-if="selectedTransaction.metadata?.feeCalculation"
              class="border-t border-gray-100 pt-6 bg-gray-25 -mx-6 px-6 py-4"
            >
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Fee Breakdown</h3>
              <div class="space-y-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-gray-600">Platform Fee ({{ selectedTransaction.metadata.feeCalculation.platformFeePercentage }}%)</span>
                  <span class="text-gray-900">₦{{ formatAmount(selectedTransaction.metadata.feeCalculation.totalPlatformFee) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Business Receives</span>
                  <span class="text-gray-900 font-semibold">₦{{ formatAmount(selectedTransaction.metadata.feeCalculation.businessReceives) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGetTransactions } from '@/composables/modules/payment/useGetTransactions'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { transactions, loading } = useGetTransactions()

const selectedTransaction = ref<any>(null)
const currentPage = ref(1)
const itemsPerPage = 10

// Sort transactions: most recent first
const sortedTransactions = computed(() => {
  if (!transactions?.value) return []
  return [...transactions.value].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

// Calculate total balance from completed transactions
const totalBalance = computed(() => {
  if (!transactions?.value) return 0
  return transactions.value
    .filter((t: any) => t.status === 'completed')
    .reduce((sum: number, t: any) => sum + t.totalAmount, 0)
})

// Pagination
const totalPages = computed(() => Math.ceil(sortedTransactions.value.length / itemsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => startIndex.value + itemsPerPage)

const paginatedTransactions = computed(() => {
  return sortedTransactions.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const selectTransaction = (transaction: any) => {
  selectedTransaction.value = transaction
}

const formatAmount = (amount: number) => {
  if (!amount) return '0.00'
  return amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatFullDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusClasses = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'failed':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

// Watch for page changes
watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.active\:bg-gray-100:active {
  background-color: rgb(243 244 246);
}
</style>