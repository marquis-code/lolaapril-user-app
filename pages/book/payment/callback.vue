<template>
  <div class="payment-page">

    <!-- ─── LOADING ─────────────────────────────────────────────────── -->
    <div v-if="verifying" class="loading-overlay">
      <div class="loader-ring"></div>
      <h2 class="loading-title">Verifying Payment</h2>
      <p class="loading-sub">Please wait while we confirm your transaction…</p>
    </div>

    <!-- ─── SPLIT LAYOUT ─────────────────────────────────────────────── -->
    <div v-else-if="verificationSuccess && paymentData" class="split-layout">

      <!-- LEFT – scrollable ------------------------------------------ -->
      <div class="left-panel">
        <div class="left-inner">

          <!-- Success badge -->
          <div class="success-badge">
            <span class="badge-icon">✓</span>
          </div>

          <h1 class="page-title">Payment Confirmed</h1>
          <p class="page-sub">Your booking is locked in — see you soon!</p>

          <div class="ref-chip">
            <span class="ref-label">REF</span>
            <span class="ref-value">{{ bookingData?.bookingNumber }}</span>
          </div>

          <!-- Appointment card -->
          <div class="card">
            <div class="card-header">Appointment</div>
            <div class="detail-row">
              <div class="detail-icon">✦</div>
              <div>
                <div class="detail-main">{{ bookingData?.services?.[0]?.serviceName }}</div>
                <div class="detail-meta">{{ bookingData?.totalDuration }} min session</div>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-icon">◈</div>
              <div>
                <div class="detail-main">{{ formatDate(bookingData?.preferredDate) }}</div>
                <div class="detail-meta">{{ bookingData?.preferredStartTime }} – {{ bookingData?.estimatedEndTime }}</div>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-icon">◉</div>
              <div>
                <div class="detail-main">{{ clientData?.firstName }} {{ clientData?.lastName }}</div>
                <div class="detail-meta">{{ clientData?.email }}</div>
              </div>
            </div>
          </div>

          <!-- Payment summary card -->
          <div class="card">
            <div class="card-header">Payment Summary</div>

            <div class="summary-row">
              <span>Subtotal</span>
              <span>₦{{ formatPrice(paymentData?.subtotal) }}</span>
            </div>
            <div v-if="paymentData?.totalDiscount > 0" class="summary-row discount">
              <span>Discount</span>
              <span>−₦{{ formatPrice(paymentData?.totalDiscount) }}</span>
            </div>
            <div v-if="paymentData?.totalTax > 0" class="summary-row">
              <span>Tax</span>
              <span>₦{{ formatPrice(paymentData?.totalTax) }}</span>
            </div>

            <div class="summary-total">
              <span>Total Paid</span>
              <span class="total-amount">₦{{ formatPrice(paymentData?.totalAmount) }}</span>
            </div>

            <div class="payment-meta">
              <div class="meta-item">
                <span class="meta-label">Method</span>
                <span class="meta-value">{{ paymentData?.paymentMethod }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Transaction ID</span>
                <span class="meta-value mono" :title="paymentData?.transactionId">{{ paymentData?.transactionId }}</span>
              </div>
            </div>
          </div>

          <!-- Commission info -->
          <div v-if="bookingData?.commissionInfo" class="card small-card">
            <div class="card-header">Commission</div>
            <div class="summary-row">
              <span>Rate</span>
              <span>{{ (bookingData.commissionInfo.commissionRate * 100) }}%</span>
            </div>
            <div class="summary-row">
              <span>Amount</span>
              <span>₦{{ formatPrice(bookingData.commissionInfo.commissionAmount) }}</span>
            </div>
            <div class="summary-row">
              <span>Reason</span>
              <span>{{ bookingData.commissionInfo.commissionReason?.replace('_', ' ') }}</span>
            </div>
          </div>

          <!-- Platform fee -->
          <div v-if="platformFeeData" class="card small-card">
            <div class="summary-row">
              <span>Platform Fee ({{ platformFeeData.platformFeePercentage }}%)</span>
              <span>₦{{ formatPrice(platformFeeData.totalPlatformFee) }}</span>
            </div>
            <div class="summary-row">
              <span class="fw-600">Business Receives</span>
              <span class="fw-600">₦{{ formatPrice(platformFeeData.businessReceives) }}</span>
            </div>
          </div>

          <!-- Reminders -->
          <div class="reminder-card">
            <div class="reminder-title">📋 Reminders</div>
            <ul class="reminder-list">
              <li>Confirmation sent to <strong>{{ clientData?.email }}</strong></li>
              <li>Arrive 10 minutes early</li>
              <li>Bring a valid ID</li>
              <li>Cancel or reschedule 24 hours in advance</li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="action-group">
            <button @click="goToBookings" class="btn-primary">View My Bookings</button>
            <div class="btn-row">
              <button
                @click="downloadPDFReceipt"
                :disabled="downloadingPDF"
                class="btn-secondary"
              >
                <span>{{ downloadingPDF ? 'Generating…' : '↓ Download PDF' }}</span>
              </button>
              <button @click="navigateTo('/')" class="btn-secondary">← Back to Home</button>
            </div>
          </div>

        </div>
      </div>

      <!-- RIGHT – sticky, never scrolls -------------------------------- -->
      <div class="right-panel">
        <img
          src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=900&q=80&fit=crop"
          alt="Wellness spa"
          class="bg-image"
        />
        <div class="right-overlay">
          <div class="overlay-content">
            <div class="overlay-logo">LA</div>
            <p class="overlay-brand">Lola April Wellness Spa</p>
            <p class="overlay-tagline">"Outside Health Starts Inside"</p>
          </div>
        </div>
      </div>

    </div>

    <!-- ─── ERROR STATE ──────────────────────────────────────────────── -->
    <div v-else-if="verificationError" class="error-state">
      <div class="error-icon">✕</div>
      <h2 class="error-title">Verification Failed</h2>
      <p class="error-msg">{{ verificationError }}</p>
      <div class="error-actions">
        <button @click="retryVerification" class="btn-primary">Retry</button>
        <button @click="navigateTo('/')" class="btn-secondary">Return Home</button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useVerifyPayment } from '@/composables/modules/payment/useVerifyPayment'
import jsPDF from 'jspdf'

const route = useRoute()
const router = useRouter()
const { verifyPayment } = useVerifyPayment()

const verifying = ref(true)
const verificationSuccess = ref(false)
const verificationError = ref<string | null>(null)
const paymentData = ref<any>(null)
const downloadingPDF = ref(false)

const bookingData = computed(() => paymentData.value?.bookingId)
const clientData = computed(() => paymentData.value?.clientId)
const platformFeeData = computed(() => paymentData.value?.metadata?.feeCalculation)

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

const formatPrice = (price: number) => {
  if (!price && price !== 0) return '0'
  return price.toLocaleString('en-NG')
}

const goToBookings = () => navigateTo('/dashboard/bookings')

const downloadPDFReceipt = async () => {
  try {
    downloadingPDF.value = true

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const PW = doc.internal.pageSize.getWidth()   // 210
    const PH = doc.internal.pageSize.getHeight()  // 297
    const M  = 20   // margin
    const CW = PW - M * 2  // content width = 170

    // ── helpers ──────────────────────────────────────────────────────────
    const setColor = (r: number, g: number, b: number) => doc.setTextColor(r, g, b)
    const setFill  = (r: number, g: number, b: number) => doc.setFillColor(r, g, b)
    const setDraw  = (r: number, g: number, b: number) => doc.setDrawColor(r, g, b)

    const txt = (
      text: string,
      x: number,
      y: number,
      size = 10,
      style: 'normal' | 'bold' = 'normal',
      align: 'left' | 'center' | 'right' = 'left',
      maxWidth?: number
    ) => {
      doc.setFontSize(size).setFont('helvetica', style)
      const opts: any = { align }
      if (maxWidth) opts.maxWidth = maxWidth
      doc.text(text, x, y, opts)
    }

    // Replace ₦ with NGN because Helvetica does not include the Naira glyph
    const money = (amount: number | undefined | null) =>
      `NGN ${(amount ?? 0).toLocaleString('en-NG')}`

    const hr = (y: number, r = 220, g = 220, b = 220, lw = 0.3) => {
      setDraw(r, g, b); doc.setLineWidth(lw)
      doc.line(M, y, PW - M, y)
    }

    const sectionHead = (label: string, y: number) => {
      setColor(0, 89, 103); txt(label, M, y, 9, 'bold')
    }

    const twoCol = (
      left: string,
      right: string,
      y: number,
      boldLeft = false,
      boldRight = false,
      greenRight = false
    ) => {
      setColor(80, 80, 80); txt(left, M, y, 9, boldLeft ? 'bold' : 'normal')
      if (greenRight) setColor(22, 163, 74)
      else setColor(30, 30, 30)
      txt(right, PW - M, y, 9, boldRight ? 'bold' : 'normal', 'right')
    }

    let Y = 0

    // ── HEADER BAND ───────────────────────────────────────────────────────
    setFill(0, 89, 103); doc.rect(0, 0, PW, 48, 'F')

    // Circle logo
    setFill(255, 255, 255); doc.circle(M + 8, 24, 9, 'F')
    setColor(0, 89, 103); txt('LA', M + 8, 27, 13, 'bold', 'center')

    // Business name
    setColor(255, 255, 255)
    txt('Lola April Wellness Spa', M + 22, 22, 16, 'bold')
    txt('Outside Health Starts Inside', M + 22, 30, 9, 'normal')

    // ── TITLE BLOCK ───────────────────────────────────────────────────────
    Y = 62
    setColor(20, 20, 20); txt('Payment Receipt', PW / 2, Y, 20, 'bold', 'center')

    Y += 10
    setFill(220, 252, 231); setDraw(134, 239, 172); doc.setLineWidth(0.4)
    doc.roundedRect(PW / 2 - 18, Y - 5, 36, 9, 2, 2, 'FD')
    setColor(22, 163, 74); txt('PAID', PW / 2, Y + 1.5, 10, 'bold', 'center')

    Y += 12
    setColor(120, 120, 120); txt('Booking Reference', PW / 2, Y, 9, 'normal', 'center')
    Y += 6
    setColor(20, 20, 20); txt(bookingData.value?.bookingNumber || 'N/A', PW / 2, Y, 13, 'bold', 'center')

    Y += 10; hr(Y)

    // ── CLIENT INFORMATION ────────────────────────────────────────────────
    Y += 10; sectionHead('CLIENT INFORMATION', Y)
    Y += 7
    setColor(30, 30, 30)
    const clientName = `${clientData.value?.firstName ?? ''} ${clientData.value?.lastName ?? ''}`.trim()
    txt(`Name:   ${clientName || 'N/A'}`, M, Y, 9)
    Y += 6; txt(`Email:   ${clientData.value?.email || 'N/A'}`, M, Y, 9)
    Y += 6; txt(`Phone:  ${(bookingData.value as any)?.clientPhone || 'N/A'}`, M, Y, 9)

    Y += 10; hr(Y)

    // ── APPOINTMENT DETAILS ───────────────────────────────────────────────
    Y += 10; sectionHead('APPOINTMENT DETAILS', Y)
    Y += 7
    const services: any[] = bookingData.value?.services ?? []
    if (services.length) {
      services.forEach((svc: any) => {
        twoCol(svc.serviceName || 'Service', money(svc.price ?? svc.amount ?? 0), Y, true, true)
        Y += 6
        if (svc.duration) {
          setColor(120, 120, 120); txt(`${svc.duration} minutes`, M + 4, Y, 8)
          Y += 6
        }
      })
    } else {
      setColor(80, 80, 80); txt('No services listed', M, Y, 9); Y += 6
    }
    Y += 2
    setColor(80, 80, 80)
    txt(`Total duration: ${bookingData.value?.totalDuration ?? 0} min`, M, Y, 9); Y += 6
    txt(`Date:   ${formatDate(bookingData.value?.preferredDate)}`, M, Y, 9); Y += 6
    txt(
      `Time:  ${bookingData.value?.preferredStartTime ?? ''} - ${bookingData.value?.estimatedEndTime ?? ''}`,
      M, Y, 9
    )

    Y += 10; hr(Y)

    // ── PAYMENT SUMMARY ───────────────────────────────────────────────────
    Y += 10; sectionHead('PAYMENT SUMMARY', Y)
    Y += 7; twoCol('Subtotal', money(paymentData.value?.subtotal), Y)

    if ((paymentData.value?.totalDiscount ?? 0) > 0) {
      Y += 6; twoCol('Discount', `-${money(paymentData.value?.totalDiscount)}`, Y, false, false, true)
    }
    if ((paymentData.value?.totalTax ?? 0) > 0) {
      Y += 6; twoCol('Tax', money(paymentData.value?.totalTax), Y)
    }

    Y += 8
    setFill(0, 89, 103); doc.rect(M, Y - 5, CW, 14, 'F')
    setColor(255, 255, 255)
    txt('TOTAL PAID', M + 4, Y + 3, 11, 'bold')
    txt(money(paymentData.value?.totalAmount), PW - M - 4, Y + 3, 11, 'bold', 'right')

    Y += 16; hr(Y)

    // ── PAYMENT DETAILS ───────────────────────────────────────────────────
    Y += 10; sectionHead('PAYMENT DETAILS', Y)
    Y += 7
    setColor(30, 30, 30)
    txt(`Payment method:   ${(paymentData.value?.paymentMethod ?? 'N/A').toUpperCase()}`, M, Y, 9)
    Y += 6

    // Transaction ID may be long — split it
    const txId: string = paymentData.value?.transactionId ?? 'N/A'
    const txLines = doc.splitTextToSize(`Transaction ID:   ${txId}`, CW)
    doc.setFontSize(9).setFont('helvetica', 'normal'); doc.text(txLines, M, Y)
    Y += txLines.length * 5.5

    const paidDateStr = paymentData.value?.paidAt
      ? new Date(paymentData.value.paidAt).toLocaleString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      : 'N/A'
    txt(`Payment date:   ${paidDateStr}`, M, Y, 9)

    Y += 10; hr(Y)

    // ── REMINDERS ─────────────────────────────────────────────────────────
    Y += 10
    setFill(239, 246, 255); setDraw(191, 219, 254); doc.setLineWidth(0.4)
    doc.roundedRect(M, Y, CW, 34, 2, 2, 'FD')
    Y += 8
    setColor(30, 64, 175); txt('Important Reminders', M + 4, Y, 9, 'bold')
    Y += 7
    const reminders = [
      'Arrive 10 minutes before your appointment',
      'Bring a valid form of identification',
      'Cancellations must be made 24 hours in advance',
      `Confirmation sent to: ${clientData.value?.email ?? ''}`,
    ]
    reminders.forEach(r => {
      setColor(51, 65, 85); txt(`- ${r}`, M + 6, Y, 8)
      Y += 5.5
    })

    // ── FOOTER ────────────────────────────────────────────────────────────
    // Always place footer near bottom
    const FY = PH - 22
    hr(FY, 200, 200, 200, 0.3)
    setColor(150, 150, 150)
    txt('Thank you for choosing Lola April Wellness Spa', PW / 2, FY + 6, 8, 'normal', 'center')
    txt('info@lolaaprilspa.com', PW / 2, FY + 11, 8, 'normal', 'center')
    txt(
      `Receipt generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      PW / 2, FY + 16, 7, 'normal', 'center'
    )

    // ── SAVE ──────────────────────────────────────────────────────────────
    const fileName = `Receipt-${bookingData.value?.bookingNumber ?? 'Payment'}.pdf`
    doc.save(fileName)

  } catch (err) {
    console.error('PDF error:', err)
    alert('Failed to generate PDF. Please try again.')
  } finally {
    downloadingPDF.value = false
  }
}

const verifyPaymentFromUrl = async () => {
  try {
    verifying.value = true
    verificationError.value = null
    const reference = route.query.reference as string || route.query.trxref as string
    if (!reference) { verificationError.value = 'Payment reference not found in URL'; verifying.value = false; return }
    const result = await verifyPayment(reference)
    if (result && result._id) { paymentData.value = result; verificationSuccess.value = true }
    else verificationError.value = 'Payment verification failed. Please contact support with your reference.'
  } catch (error: any) {
    verificationError.value = error.message || 'An error occurred. Please try again or contact support.'
  } finally {
    verifying.value = false
  }
}

const retryVerification = () => verifyPaymentFromUrl()
onMounted(() => verifyPaymentFromUrl())
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

/* ─── Reset / Base ─────────────────────────────────────────── */
* { box-sizing: border-box; margin: 0; padding: 0; }

.payment-page {
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  background: #f5f4f0;
  color: #1a1a1a;
}

/* ─── Split layout ─────────────────────────────────────────── */
.split-layout {
  display: flex;
  min-height: 100vh;
}

/* LEFT – scrollable */
.left-panel {
  flex: 0 0 55%;
  max-width: 55%;
  overflow-y: auto;
  background: #f5f4f0;
  padding: 0 0 60px;
}

.left-inner {
  max-width: 540px;
  margin: 0 auto;
  padding: 56px 40px 0;
}

/* RIGHT – sticky, never scrolls */
.right-panel {
  flex: 0 0 45%;
  max-width: 45%;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.right-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(0,89,103,0.72) 0%, rgba(0,40,50,0.85) 100%);
  display: flex;
  align-items: flex-end;
  padding: 48px;
}

.overlay-content {
  color: #fff;
}

.overlay-logo {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(255,255,255,0.18);
  border: 1.5px solid rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Serif Display', serif;
  font-size: 20px;
  color: #fff;
  margin-bottom: 16px;
  backdrop-filter: blur(8px);
}

.overlay-brand {
  font-family: 'DM Serif Display', serif;
  font-size: 26px;
  font-weight: 400;
  line-height: 1.2;
  margin-bottom: 8px;
}

.overlay-tagline {
  font-size: 13px;
  font-style: italic;
  opacity: 0.75;
  letter-spacing: 0.02em;
}

/* ─── Success badge ────────────────────────────────────────── */
.success-badge {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #005967;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.badge-icon {
  color: #fff;
  font-size: 22px;
  font-weight: 600;
}

.page-title {
  font-family: 'DM Serif Display', serif;
  font-size: 36px;
  font-weight: 400;
  color: #111;
  line-height: 1.1;
  margin-bottom: 8px;
}

.page-sub {
  font-size: 15px;
  color: #777;
  margin-bottom: 24px;
}

.ref-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e2e8e6;
  border-radius: 100px;
  padding: 6px 16px;
  margin-bottom: 32px;
}

.ref-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #005967;
  background: rgba(0,89,103,0.08);
  padding: 2px 7px;
  border-radius: 100px;
}

.ref-value {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
}

/* ─── Cards ────────────────────────────────────────────────── */
.card {
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 16px;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}

.small-card {
  padding: 20px 28px;
}

.card-header {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #005967;
  margin-bottom: 20px;
}

/* Detail rows */
.detail-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child { border-bottom: none; padding-bottom: 0; }
.detail-row:first-of-type { padding-top: 0; }

.detail-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(0,89,103,0.07);
  color: #005967;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.detail-main {
  font-size: 14px;
  font-weight: 500;
  color: #111;
  margin-bottom: 3px;
}

.detail-meta {
  font-size: 12px;
  color: #888;
}

/* Summary rows */
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #555;
  padding: 7px 0;
}

.summary-row.discount { color: #16a34a; }
.summary-row.discount span:last-child { font-weight: 500; }

.fw-600 { font-weight: 600; color: #111; }

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0 0;
  margin-top: 8px;
  border-top: 1.5px solid #e8e8e8;
  font-size: 15px;
  font-weight: 600;
  color: #111;
}

.total-amount {
  font-family: 'DM Serif Display', serif;
  font-size: 26px;
  font-weight: 400;
  color: #005967;
}

.payment-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.meta-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #aaa;
  margin-bottom: 4px;
}

.meta-value {
  font-size: 13px;
  font-weight: 500;
  color: #111;
  display: block;
}

.meta-value.mono {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── Reminders ────────────────────────────────────────────── */
.reminder-card {
  background: rgba(0,89,103,0.05);
  border: 1px solid rgba(0,89,103,0.12);
  border-radius: 20px;
  padding: 24px 28px;
  margin-bottom: 32px;
}

.reminder-title {
  font-size: 13px;
  font-weight: 600;
  color: #005967;
  margin-bottom: 12px;
}

.reminder-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reminder-list li {
  font-size: 13px;
  color: #444;
  padding-left: 16px;
  position: relative;
}

.reminder-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #005967;
  font-size: 11px;
}

/* ─── Buttons ──────────────────────────────────────────────── */
.action-group { display: flex; flex-direction: column; gap: 12px; }

.btn-primary {
  width: 100%;
  background: #005967;
  color: #fff;
  border: none;
  border-radius: 100px;
  padding: 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  letter-spacing: 0.01em;
}

.btn-primary:hover { background: #004552; transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }

.btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.btn-secondary {
  width: 100%;
  background: #fff;
  color: #333;
  border: 1.5px solid #e0e0e0;
  border-radius: 100px;
  padding: 14px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.btn-secondary:hover { background: #f7f7f5; border-color: #c8c8c8; }
.btn-secondary:disabled { opacity: 0.5; cursor: not-allowed; }

/* ─── Loading ──────────────────────────────────────────────── */
.loading-overlay {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: #f5f4f0;
}

.loader-ring {
  width: 48px;
  height: 48px;
  border: 3px solid #e0e0e0;
  border-top-color: #005967;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.loading-title {
  font-family: 'DM Serif Display', serif;
  font-size: 22px;
  font-weight: 400;
  color: #111;
}

.loading-sub { font-size: 14px; color: #888; }

/* ─── Error ────────────────────────────────────────────────── */
.error-state {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px;
  background: #f5f4f0;
  text-align: center;
}

.error-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fef2f2;
  color: #dc2626;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-title {
  font-family: 'DM Serif Display', serif;
  font-size: 26px;
  font-weight: 400;
  color: #111;
}

.error-msg { font-size: 14px; color: #666; max-width: 400px; }

.error-actions { display: flex; gap: 12px; margin-top: 8px; }
.error-actions .btn-primary { width: 140px; }
.error-actions .btn-secondary { width: 140px; }

/* ─── Responsive ───────────────────────────────────────────── */
@media (max-width: 768px) {
  .split-layout { flex-direction: column; }

  .left-panel,
  .right-panel {
    flex: none;
    max-width: 100%;
    width: 100%;
  }

  .right-panel {
    position: relative;
    height: 220px;
    order: -1;
  }

  .left-inner {
    padding: 32px 24px 0;
  }

  .overlay-content { padding: 0; }
  .overlay-brand { font-size: 20px; }
}
</style>