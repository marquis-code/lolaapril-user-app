<template>
  <div class="min-h-screen pt-6">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- <h1 class="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Wallet</h1> -->

      <!-- Balance Card -->
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 mb-6 shadow-lg">
        <div class="text-center">
          <p class="text-sm text-gray-300 mb-2">Total Transactions Amount</p>
          <p class="text-3xl sm:text-4xl font-bold text-white mb-6">₦{{ formatAmount(totalBalance) }}</p>
          <!-- <button
            class="bg-white text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Add Funds
          </button> -->
        </div>
      </div>

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
        <div v-else-if="sortedTransactions.length === 0" class="text-center py-16 px-4">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <p class="text-gray-600 font-medium mb-1">No transactions yet</p>
          <p class="text-gray-500 text-sm">Your transaction history will appear here</p>
        </div>

        <!-- Desktop View - Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b-[0.5px] border-gray-50 bg-gray-25">
                <th class="px-6 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th class="px-6 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Business</th>
                <th class="px-6 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th class="px-6 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody class="divide-y-[0.5px] divide-gray-25">
              <tr
                v-for="transaction in paginatedTransactions"
                :key="transaction._id"
                class="hover:bg-gray-25 transition-colors"
              >
                <td class="px-6 py-6 text-gray-600 whitespace-nowrap">
                  {{ formatDate(transaction.paidAt || transaction.createdAt) }}
                </td>

                <td class="px-6 py-6">
                  <p class="font-medium text-gray-900 truncate max-w-xs">
                    {{ transaction.businessId?.businessName || 'Unknown Business' }}
                  </p>
                </td>
                <td class="px-6 py-6">
                  <p class="text-gray-600 truncate max-w-xs">
                    {{ transaction.items?.[0]?.itemName || 'Payment' }}
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    Ref: {{ transaction.paymentReference }}
                  </p>
                </td>

                <td class="px-6 py-6 font-semibold text-gray-900 whitespace-nowrap">
                  ₦{{ formatAmount(transaction.totalAmount) }}
                </td>

                <td class="px-6 py-6 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="statusClasses(transaction.status)"
                  >
                    {{ transaction.status }}
                  </span>
                </td>

                <td class="px-6 py-6 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      @click="selectTransaction(transaction)"
                      class="text-parentPrimary hover:text-parentPrimary-700 font-medium text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
                    </button>
                    <button
                      @click="downloadReceipt(transaction)"
                      :disabled="downloadingPDF"
                      class="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                      title="Download Receipt"
                    >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000000" viewBox="0 0 256 256"><path d="M248,128a87.34,87.34,0,0,1-17.6,52.81,8,8,0,1,1-12.8-9.62A71.34,71.34,0,0,0,232,128a72,72,0,0,0-144,0,8,8,0,0,1-16,0,88,88,0,0,1,3.29-23.88C74.2,104,73.1,104,72,104a48,48,0,0,0,0,96H96a8,8,0,0,1,0,16H72A64,64,0,1,1,81.29,88.68,88,88,0,0,1,248,128Zm-69.66,42.34L160,188.69V128a8,8,0,0,0-16,0v60.69l-18.34-18.35a8,8,0,0,0-11.32,11.32l32,32a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z"></path></svg>
                    </button>
                  </div>
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
                    ? 'bg-parentPrimary text-white'
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
        class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
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
              class="border-t border-gray-100 pt-6 bg-gray-50 -mx-6 px-6 py-4 rounded-lg"
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

            <!-- Download Button -->
            <button
              @click="downloadReceipt(selectedTransaction)"
              :disabled="downloadingPDF"
              class="w-full bg-gray-900 text-white font-semibold py-3 rounded-full text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#f7f7f7" viewBox="0 0 256 256"><path d="M248,128a87.34,87.34,0,0,1-17.6,52.81,8,8,0,1,1-12.8-9.62A71.34,71.34,0,0,0,232,128a72,72,0,0,0-144,0,8,8,0,0,1-16,0,88,88,0,0,1,3.29-23.88C74.2,104,73.1,104,72,104a48,48,0,0,0,0,96H96a8,8,0,0,1,0,16H72A64,64,0,1,1,81.29,88.68,88,88,0,0,1,248,128Zm-69.66,42.34L160,188.69V128a8,8,0,0,0-16,0v60.69l-18.34-18.35a8,8,0,0,0-11.32,11.32l32,32a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z"></path></svg>
               <span v-if="downloadingPDF">Generating PDF...</span>
              <span v-else>Download Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGetTransactions } from '@/composables/modules/payment/useGetTransactions'
import jsPDF from 'jspdf'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const { transactions, loading } = useGetTransactions()

const selectedTransaction = ref<any>(null)
const currentPage = ref(1)
const itemsPerPage = 10
const downloadingPDF = ref(false)

// Sort transactions: most recent first
const sortedTransactions = computed(() => {
  if (!transactions?.value || !Array.isArray(transactions.value)) return []
  return [...transactions.value].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

// Calculate total balance from completed transactions
const totalBalance = computed(() => {
  if (!transactions?.value || !Array.isArray(transactions.value)) return 0
  return transactions.value
    .filter((t: any) => t.status === 'completed')
    .reduce((sum: number, t: any) => sum + (t.totalAmount || 0), 0)
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
  if (!amount && amount !== 0) return '0.00'
  return amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatDate = (date: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatFullDate = (date: string) => {
  if (!date) return 'N/A'
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

const downloadReceipt = async (transaction: any) => {
  try {
    downloadingPDF.value = true
    
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    
    // Colors
    const parentPrimaryColor = [0, 89, 103]
    const darkGray = [51, 51, 51]
    const mediumGray = [107, 114, 128]
    const lightGray = [220, 220, 220]
    
    let yPos = margin
    
    // ============= HEADER =============
    doc.setFillColor(...parentPrimaryColor)
    doc.rect(0, 0, pageWidth, 55, 'F')
    
    // Logo
    doc.setFillColor(255, 255, 255)
    doc.circle(30, 27, 10, 'F')
    doc.setTextColor(...parentPrimaryColor)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    const businessInitials = (transaction.businessId?.businessName || 'BU').substring(0, 2).toUpperCase()
    doc.text(businessInitials, 30, 30, { align: 'center' })
    
    // Business Name
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(transaction.businessId?.businessName || 'Business', 48, 25)
    
    // Tagline
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Transaction Receipt', 48, 33)
    
    // ============= TITLE =============
    yPos = 70
    doc.setTextColor(...darkGray)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('Payment Receipt', pageWidth / 2, yPos, { align: 'center' })
    
    // Status Badge
    yPos += 14
    doc.setFillColor(220, 252, 231)
    doc.setDrawColor(134, 239, 172)
    doc.roundedRect(pageWidth / 2 - 22, yPos - 5, 44, 10, 2, 2, 'FD')
    doc.setTextColor(22, 163, 74)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(transaction.status.toUpperCase(), pageWidth / 2, yPos + 1, { align: 'center' })
    
    // Transaction Reference
    yPos += 14
    doc.setTextColor(...mediumGray)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text('Payment Reference', pageWidth / 2, yPos, { align: 'center' })
    
    yPos += 7
    doc.setTextColor(...darkGray)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(transaction.paymentReference || 'N/A', pageWidth / 2, yPos, { align: 'center' })
    
    // Divider
    yPos += 12
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(0.5)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    
    // ============= TRANSACTION INFO =============
    yPos += 12
    doc.setTextColor(...parentPrimaryColor)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('TRANSACTION INFORMATION', margin, yPos)
    
    yPos += 10
    doc.setTextColor(...darkGray)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    
    doc.text(`Business: ${transaction.businessId?.businessName || 'N/A'}`, margin, yPos)
    yPos += 7
    
    doc.text(`Transaction ID: ${transaction.transactionId || 'N/A'}`, margin, yPos)
    yPos += 7
    
    const txDate = formatFullDate(transaction.paidAt || transaction.createdAt)
    doc.text(`Date: ${txDate}`, margin, yPos)
    yPos += 7
    
    doc.text(`Payment Method: ${transaction.paymentMethod?.toUpperCase() || 'N/A'}`, margin, yPos)
    yPos += 7
    
    doc.text(`Gateway: ${transaction.gateway?.toUpperCase() || 'N/A'}`, margin, yPos)
    
    // Divider
    yPos += 10
    doc.setDrawColor(...lightGray)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    
    // ============= ITEMS =============
    yPos += 12
    doc.setTextColor(...parentPrimaryColor)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('ITEMS', margin, yPos)
    
    yPos += 10
    doc.setTextColor(...darkGray)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    
    const items = transaction.items || []
    
    if (items.length > 0) {
      items.forEach((item: any, index: number) => {
        const itemName = item.itemName || 'Item'
        const itemPrice = item.totalPrice || 0
        const itemQty = item.quantity || 1
        const itemUnit = item.unitPrice || 0
        
        doc.setFont('helvetica', 'bold')
        doc.text(`${index + 1}. ${itemName}`, margin, yPos)
        doc.text(`₦${formatAmount(itemPrice)}`, pageWidth - margin, yPos, { align: 'right' })
        
        yPos += 7
        
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...mediumGray)
        doc.setFontSize(10)
        doc.text(`Qty: ${itemQty} × ₦${formatAmount(itemUnit)}`, margin + 5, yPos)
        doc.setTextColor(...darkGray)
        doc.setFontSize(11)
        yPos += 8
      })
    } else {
      doc.text('No items listed', margin, yPos)
      yPos += 8
    }
    
    // Divider
    yPos += 4
    doc.setDrawColor(...lightGray)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    
    // ============= PAYMENT SUMMARY =============
    yPos += 12
    doc.setTextColor(...parentPrimaryColor)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('PAYMENT SUMMARY', margin, yPos)
    
    yPos += 10
    doc.setTextColor(...darkGray)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    
    // Subtotal
    doc.text('Subtotal', margin, yPos)
    doc.text(`₦${formatAmount(transaction.subtotal || 0)}`, pageWidth - margin, yPos, { align: 'right' })
    yPos += 7
    
    // Discount
    if (transaction.totalDiscount > 0) {
      doc.setTextColor(22, 163, 74)
      doc.text('Discount', margin, yPos)
      doc.text(`-₦${formatAmount(transaction.totalDiscount)}`, pageWidth - margin, yPos, { align: 'right' })
      doc.setTextColor(...darkGray)
      yPos += 7
    }
    
    // Tax
    if (transaction.totalTax > 0) {
      doc.text('Tax', margin, yPos)
      doc.text(`₦${formatAmount(transaction.totalTax)}`, pageWidth - margin, yPos, { align: 'right' })
      yPos += 7
    }
    
    // Total Line
    yPos += 4
    doc.setDrawColor(...parentPrimaryColor)
    doc.setLineWidth(1)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    
    yPos += 10
    doc.setTextColor(...parentPrimaryColor)
    doc.setFontSize(15)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL PAID', margin, yPos)
    doc.text(`₦${formatAmount(transaction.totalAmount || 0)}`, pageWidth - margin, yPos, { align: 'right' })
    
    // Refunded Amount
    if (transaction.refundedAmount > 0) {
      yPos += 8
      doc.setFontSize(11)
      doc.setTextColor(220, 38, 38)
      doc.text('Refunded', margin, yPos)
      doc.text(`-₦${formatAmount(transaction.refundedAmount)}`, pageWidth - margin, yPos, { align: 'right' })
    }
    
    // Divider
    yPos += 8
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(0.5)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    
    // ============= PLATFORM FEE (if available) =============
    if (transaction.metadata?.feeCalculation) {
      yPos += 12
      doc.setTextColor(...parentPrimaryColor)
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text('FEE BREAKDOWN', margin, yPos)
      
      yPos += 10
      doc.setTextColor(...darkGray)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      const feeCalc = transaction.metadata.feeCalculation
      doc.text(`Platform Fee (${feeCalc.platformFeePercentage}%)`, margin, yPos)
      doc.text(`₦${formatAmount(feeCalc.totalPlatformFee)}`, pageWidth - margin, yPos, { align: 'right' })
      yPos += 6
      
      doc.setFont('helvetica', 'bold')
      doc.text('Business Receives', margin, yPos)
      doc.text(`₦${formatAmount(feeCalc.businessReceives)}`, pageWidth - margin, yPos, { align: 'right' })
      
      yPos += 8
      doc.setDrawColor(...lightGray)
      doc.line(margin, yPos, pageWidth - margin, yPos)
    }
    
    // ============= FOOTER =============
    yPos += 20
    
    // Check if we need a new page
    if (yPos > pageHeight - 40) {
      doc.addPage()
      yPos = 30
    }
    
    doc.setDrawColor(...lightGray)
    doc.setLineWidth(0.3)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    
    yPos += 7
    doc.setTextColor(...mediumGray)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Thank you for your business', pageWidth / 2, yPos, { align: 'center' })
    
    yPos += 6
    doc.setFontSize(9)
    doc.text(`Receipt generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, yPos, { align: 'center' })
    
    // Save PDF
    const fileName = `Receipt-${transaction.paymentReference || 'Transaction'}.pdf`
    doc.save(fileName)
    
  } catch (error) {
    console.error('PDF Generation Error:', error)
    alert('Failed to generate receipt. Please try again.')
  } finally {
    downloadingPDF.value = false
  }
}

// Watch for page changes
watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.bg-parentPrimary {
  background-color: #005967;
}

.text-parentPrimary {
  color: #005967;
}

.text-parentPrimary-700 {
  color: #004552;
}

.active\:bg-gray-100:active {
  background-color: rgb(243 244 246);
}
</style>