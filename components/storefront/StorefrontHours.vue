<template>
  <section v-if="businessHours?.length" id="hours" class="section hours-section">
    <div class="container">
      <!-- Header with live clock -->
      <div class="hours-header">
        <div class="header-content">
          <span class="header-label">Schedule</span>
          <h2 class="section-title">{{ title || 'Business Hours' }}</h2>
          <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
        </div>
        
        <!-- Live Status Badge -->
        <div class="live-status" :class="isCurrentlyOpen ? 'live-status--open' : 'live-status--closed'">
          <div class="status-glow"></div>
          <span class="status-icon">
            <svg v-if="isCurrentlyOpen" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </span>
          <div class="status-text">
            <span class="status-label">{{ isCurrentlyOpen ? 'Open Now' : 'Closed' }}</span>
            <span class="current-time">{{ currentTimeDisplay }}</span>
          </div>
        </div>
      </div>

      <!-- Week Grid -->
      <div class="week-grid">
        <div 
          v-for="(day, index) in formattedHours" 
          :key="day.day"
          class="day-card"
          :class="{ 
            'day-card--today': day.isToday,
            'day-card--closed': !day.isOpen,
            'day-card--weekend': day.isWeekend
          }"
          :style="{ '--delay': `${index * 0.05}s` }"
        >
          <!-- Day indicator -->
          <div class="day-indicator">
            <span class="day-abbr">{{ day.dayAbbr }}</span>
            <span v-if="day.isToday" class="today-marker">
              <span class="today-pulse"></span>
            </span>
          </div>
          
          <!-- Day name & date -->
          <div class="day-info">
            <span class="day-name">{{ day.dayName }}</span>
            <span v-if="day.isToday" class="today-tag">Today</span>
          </div>
          
          <!-- Time display -->
          <div class="time-display">
            <template v-if="day.isOpen">
              <div class="time-block">
                <span class="time-label">Opens</span>
                <span class="time-value">{{ day.openTime }}</span>
              </div>
              <div class="time-divider">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
              <div class="time-block">
                <span class="time-label">Closes</span>
                <span class="time-value">{{ day.closeTime }}</span>
              </div>
            </template>
            <template v-else>
              <div class="closed-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
                <span>Closed</span>
              </div>
            </template>
          </div>

          <!-- Progress bar for today -->
          <div v-if="day.isToday && day.isOpen" class="day-progress">
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: dayProgress + '%' }"></div>
              <div class="progress-marker" :style="{ left: dayProgress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick info footer -->
      <div class="hours-footer">
        <div class="footer-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>{{ timezone }}</span>
        </div>
        <div class="footer-divider"></div>
        <div class="footer-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>{{ openDaysCount }} days a week</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface BusinessHour {
  day: string
  isOpen: boolean
  openTime: string
  closeTime: string
  breaks?: Array<{ openTime: string; closeTime: string }>
}

interface Props {
  title?: string
  subtitle?: string
  businessHours?: BusinessHour[]
  timezone?: string
  config?: any
}

const props = withDefaults(defineProps<Props>(), {
  businessHours: () => [],
  timezone: 'Africa/Lagos'
})

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const dayNames: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday', 
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
}

const dayAbbreviations: Record<string, string> = {
  monday: 'M',
  tuesday: 'T', 
  wednesday: 'W',
  thursday: 'T',
  friday: 'F',
  saturday: 'S',
  sunday: 'S'
}

// Get current day name
const getCurrentDay = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days[new Date().getDay()]
}

const currentDay = ref(getCurrentDay())
const currentTime = ref(new Date())

// Live clock display
const currentTimeDisplay = computed(() => {
  const hours = currentTime.value.getHours()
  const minutes = currentTime.value.getMinutes()
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
})

// Format business hours for display
const formattedHours = computed(() => {
  if (!props.businessHours?.length) return []

  // Create a map for quick lookup
  const hoursMap = new Map<string, BusinessHour>()
  props.businessHours.forEach(h => {
    hoursMap.set(h.day.toLowerCase(), h)
  })

  // Return in order
  return dayOrder.map(day => {
    const hours = hoursMap.get(day)
    return {
      day,
      dayName: dayNames[day] || day,
      dayAbbr: dayAbbreviations[day] || day.charAt(0).toUpperCase(),
      isOpen: hours?.isOpen ?? false,
      openTime: formatTime(hours?.openTime),
      closeTime: formatTime(hours?.closeTime),
      isToday: day === currentDay.value,
      isWeekend: day === 'saturday' || day === 'sunday'
    }
  })
})

// Count open days
const openDaysCount = computed(() => {
  return formattedHours.value.filter(d => d.isOpen).length
})

// Format time (e.g., "09:00" to "9:00 AM")
const formatTime = (time?: string): string => {
  if (!time) return ''
  
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

// Check if currently open
const isCurrentlyOpen = computed(() => {
  const todayHours = props.businessHours?.find(
    h => h.day.toLowerCase() === currentDay.value
  )
  
  if (!todayHours || !todayHours.isOpen) return false

  const now = new Date()
  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes()

  const [openH, openM] = (todayHours.openTime || '00:00').split(':').map(Number)
  const [closeH, closeM] = (todayHours.closeTime || '00:00').split(':').map(Number)
  
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  return currentTimeMinutes >= openMinutes && currentTimeMinutes <= closeMinutes
})

// Calculate day progress percentage
const dayProgress = computed(() => {
  const todayHours = props.businessHours?.find(
    h => h.day.toLowerCase() === currentDay.value
  )
  
  if (!todayHours || !todayHours.isOpen) return 0

  const now = new Date()
  const currentTimeMinutes = now.getHours() * 60 + now.getMinutes()

  const [openH, openM] = (todayHours.openTime || '00:00').split(':').map(Number)
  const [closeH, closeM] = (todayHours.closeTime || '00:00').split(':').map(Number)
  
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM
  const totalMinutes = closeMinutes - openMinutes

  if (currentTimeMinutes < openMinutes) return 0
  if (currentTimeMinutes > closeMinutes) return 100

  return Math.round(((currentTimeMinutes - openMinutes) / totalMinutes) * 100)
})

// Update current day and time periodically
onMounted(() => {
  const interval = setInterval(() => {
    currentDay.value = getCurrentDay()
    currentTime.value = new Date()
  }, 30000) // Update every 30 seconds

  onUnmounted(() => clearInterval(interval))
})
</script>

<style scoped>
.hours-section {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
}

.hours-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
}

/* Header */
.hours-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-content {
  flex: 1;
}

.header-label {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary, #3b82f6);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text, #1e293b);
  margin: 0;
}

.section-subtitle {
  color: var(--color-muted, #64748b);
  margin-top: 0.5rem;
  font-size: 1rem;
}

/* Live Status */
.live-status {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.25rem;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  min-width: 180px;
}

.status-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0.15;
  transition: opacity 0.3s;
}

.live-status--open {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.08));
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.live-status--open .status-glow {
  background: radial-gradient(ellipse at center, #10b981 0%, transparent 70%);
}

.live-status--open .status-icon {
  color: #059669;
}

.live-status--closed {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.08));
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.live-status--closed .status-glow {
  background: radial-gradient(ellipse at center, #ef4444 0%, transparent 70%);
}

.live-status--closed .status-icon {
  color: #dc2626;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.status-text {
  display: flex;
  flex-direction: column;
}

.status-label {
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-text, #1e293b);
}

.current-time {
  font-size: 0.75rem;
  color: var(--color-muted, #64748b);
  font-variant-numeric: tabular-nums;
}

/* Week Grid */
.week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;
}

@media (max-width: 1024px) {
  .week-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 640px) {
  .week-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Day Card */
.day-card {
  background: white;
  border-radius: 16px;
  padding: 1.25rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.5s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
  position: relative;
  overflow: hidden;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.day-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-color: rgba(59, 130, 246, 0.2);
}

.day-card--today {
  background: linear-gradient(135deg, var(--color-primary, #3b82f6) 0%, #2563eb 100%);
  border-color: transparent;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.35);
}

.day-card--today:hover {
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.45);
  border-color: transparent;
}

.day-card--today .day-abbr,
.day-card--today .day-name,
.day-card--today .time-value,
.day-card--today .time-label,
.day-card--today .time-divider {
  color: white;
}

.day-card--today .time-label {
  color: rgba(255, 255, 255, 0.7);
}

.day-card--closed:not(.day-card--today) {
  background: #fafafa;
}

.day-card--closed:not(.day-card--today) .day-indicator,
.day-card--closed:not(.day-card--today) .day-info,
.day-card--closed:not(.day-card--today) .time-display {
  opacity: 0.5;
}

/* Day Indicator */
.day-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.day-abbr {
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--color-primary, #3b82f6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.today-marker {
  position: relative;
  width: 8px;
  height: 8px;
}

.today-pulse {
  position: absolute;
  inset: 0;
  background: white;
  border-radius: 50%;
  animation: todayPulse 2s ease-in-out infinite;
}

@keyframes todayPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
}

/* Day Info */
.day-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.day-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text, #1e293b);
}

.today-tag {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(255, 255, 255, 0.25);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

/* Time Display */
.time-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.time-block {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.time-label {
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted, #94a3b8);
}

.time-value {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-text, #1e293b);
  font-variant-numeric: tabular-nums;
}

.time-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted, #cbd5e1);
  transform: rotate(90deg);
  margin: 0.25rem 0;
}

.closed-state {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-muted, #94a3b8);
  font-size: 0.875rem;
  font-weight: 500;
}

/* Day Progress */
.day-progress {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 9999px;
  position: relative;
  overflow: visible;
}

.progress-fill {
  height: 100%;
  background: white;
  border-radius: 9999px;
  transition: width 0.5s ease;
}

.progress-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: left 0.5s ease;
}

/* Footer */
.hours-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1.25rem;
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-muted, #64748b);
}

.footer-item svg {
  color: var(--color-primary, #3b82f6);
}

.footer-divider {
  width: 1px;
  height: 20px;
  background: var(--color-border, #e2e8f0);
}

@media (max-width: 640px) {
  .hours-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .live-status {
    justify-content: center;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .hours-footer {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .footer-divider {
    width: 40px;
    height: 1px;
  }
}
</style>
