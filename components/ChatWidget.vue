<template>
  <ClientOnly>
    <div class="z-[99999] flex flex-col items-end gap-3">
      <Transition name="fade">
        <div
          v-if="isOpen"
          :class="[
            'max-h-[75vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col',
            'w-[520px] sm:w-[600px] md:w-[700px]',
            isMobile() ? 'fixed inset-0 w-screen h-screen max-h-none rounded-none z-[999999]' : ''
          ]"
        >
          <div class="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
            <div>
              <p class="text-sm font-semibold">Chat with us</p>
              <p class="text-xs text-white/70">
                {{ isConnected ? 'Online' : 'Connecting...' }}
              </p>
            </div>
            <button
              @click="isOpen = false"
              class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-if="isGuest && needsGuestInfo" class="px-4 py-4 space-y-3 border-b border-gray-100">
            <p class="text-xs text-gray-600">Tell us your name and email to start.</p>
            <input
              v-model="guestProfile.name"
              type="text"
              placeholder="Your name"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <input
              v-model="guestProfile.email"
              type="email"
              placeholder="Email address"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <input
              v-model="guestProfile.phone"
              type="tel"
              placeholder="Phone (optional)"
              class="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              @click="startChat"
              class="w-full rounded-xl bg-gray-900 text-white py-2 text-sm font-semibold"
            >
              Start chat
            </button>
          </div>

          <div ref="messageContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
            <!-- FAQs Section -->
            <div v-if="faqs.length > 0 && messages.length === 0" class="space-y-2">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wide">Frequently Asked Questions</p>
              <div class="space-y-2">
                <button
                  v-for="faq in faqs.slice(0, 5)"
                  :key="faq._id"
                  @click="handleFaqClick(faq)"
                  class="w-full text-left px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all"
                >
                  {{ faq.question }}
                </button>
              </div>
              <p v-if="faqs.length > 5" class="text-xs text-gray-400 text-center mt-2">
                Or type your own question below
              </p>
            </div>

            <!-- Messages -->
            <div
              v-for="(message, idx) in messages"
              :key="message.id || message.createdAt"
              class="flex"
              :class="getBubblePosition(message)"
              :style="{
                marginTop: idx > 0 && messages[idx-1]?.senderType !== message.senderType ? '40px' : '6px',
                marginBottom: idx < messages.length - 1 && messages[idx+1]?.senderType !== message.senderType ? '40px' : '',
              }"
            >
              <div
                class="max-w-[85%] rounded-2xl px-5 py-3 text-xs shadow-sm"
                :class="getBubbleStyle(message)"
              >
                <p class="text-[12px] font-semibold mb-1" :class="getBubbleLabelStyle(message)" v-if="showSenderLabel(message)">
                  {{ message.senderName || (message.senderType === 'bot' ? 'Bot' : 'Support') }}
                </p>
                <p class="whitespace-pre-wrap leading-relaxed text-[13px]">{{ message.content }}</p>
                <p class="text-[10px] mt-1.5 text-right" :class="getBubbleTimeStyle(message)" v-if="message.createdAt">
                  {{ formatTime(message.createdAt) }}
                </p>
              </div>
            </div>
            <div v-if="isTyping" class="text-xs text-gray-500 italic">Someone is typing...</div>
          </div>

          <div class="border-t border-gray-100 px-3 py-3 bg-white">
            <div class="flex items-center gap-2">
              <input
                v-model="newMessage"
                type="text"
                placeholder="Type your message..."
                class="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                @input="handleTyping"
                @keyup.enter="handleSend"
                :disabled="isGuest && needsGuestInfo"
              />
              <button
                @click="handleSend"
                :disabled="sending || !newMessage.trim() || (isGuest && needsGuestInfo)"
                class="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center disabled:opacity-50"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <button
        @click="toggleChat"
        class="w-14 h-14 rounded-full bg-gray-900 text-white shadow-xl flex items-center justify-center hover:scale-105 transition"
        aria-label="Open chat"
      >
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fafafa" viewBox="0 0 256 256"><path d="M216,80H184V48a16,16,0,0,0-16-16H40A16,16,0,0,0,24,48V176a8,8,0,0,0,13,6.22L72,154V184a16,16,0,0,0,16,16h93.59L219,230.22a8,8,0,0,0,5,1.78,8,8,0,0,0,8-8V96A16,16,0,0,0,216,80ZM66.55,137.78,40,159.25V48H168v88H71.58A8,8,0,0,0,66.55,137.78ZM216,207.25l-26.55-21.47a8,8,0,0,0-5-1.78H88V152h80a16,16,0,0,0,16-16V96h32Z"></path></svg>
        <!-- <svg v-if="!isOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 10.5V7a5 5 0 00-10 0v3.5A5.5 5.5 0 0012 19a5.5 5.5 0 005-8.5z" />
          <circle cx="12" cy="15" r="1" fill="currentColor" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 17v.01" />
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg> -->
      </button>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
// Helper to detect mobile
function isMobile() {
  return window.innerWidth <= 640;
}
import { useChat } from '@/composables/modules/chat/useChat'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'

const isOpen = ref(false)
const newMessage = ref('')
const messageContainer = ref<HTMLDivElement | null>(null)
const typingTimeout = ref<number | null>(null)
const isTyping = ref(false)

const {
  room,
  messages,
  faqs,
  sending,
  loadingFaqs,
  isGuest,
  guestProfile,
  ensureRoom,
  loadFaqs,
  markAsRead,
  sendMessage,
  sendFaqQuestion,
  attachSocketListeners,
  detachSocketListeners,
  isMine,
} = useChat()

// Helper: always right for customer/guest, always left for staff/bot
function getBubblePosition(message) {
  if (message.senderType === 'customer' || message.senderType === 'guest') {
    return 'justify-end';
  }
  return 'justify-start';
}

function getBubbleStyle(message) {
  if (message.senderType === 'customer' || message.senderType === 'guest') {
    return 'bg-gray-900 text-white rounded-br-sm ml-auto';
  }
  return 'bg-white text-gray-800 rounded-bl-sm border border-gray-100 mr-auto';
}

function getBubbleLabelStyle(message) {
  if (message.senderType === 'customer' || message.senderType === 'guest') {
    return 'text-white/70';
  }
  return 'text-primary';
}

function getBubbleTimeStyle(message) {
  if (message.senderType === 'customer' || message.senderType === 'guest') {
    return 'text-white/50';
  }
  return 'text-gray-400';
}

function showSenderLabel(message) {
  // Only show label for staff/bot, not for customer/guest
  return message.senderType !== 'customer' && message.senderType !== 'guest';
}

const { socket, connectSocket, isConnected } = useRealtimeSocket()

const needsGuestInfo = computed(() => !guestProfile.value.name || !guestProfile.value.email)

const toggleChat = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await startChat()
    await loadFaqs()
  }
}

const startChat = async () => {
  connectSocket()
  if (!needsGuestInfo.value || !isGuest.value) {
    await ensureRoom()
    await markAsRead()
  }
}

const handleSend = async () => {
  if (!newMessage.value.trim()) return
  if (isGuest.value && needsGuestInfo.value) return
  if (!room.value?._id) {
    await startChat()
  }
  const messageText = newMessage.value
  newMessage.value = ''
  await sendMessage(messageText)
}

const handleFaqClick = async (faq: any) => {
  if (isGuest.value && needsGuestInfo.value) return
  if (!room.value?._id) {
    await startChat()
  }
  await sendFaqQuestion(faq)
}

const handleTyping = () => {
  if (!socket.value || !room.value?._id) return
  socket.value.emit('chat:typing', { roomId: room.value._id, isTyping: true })

  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }

  typingTimeout.value = window.setTimeout(() => {
    socket.value?.emit('chat:typing', { roomId: room.value?._id, isTyping: false })
  }, 1200)
}

const formatTime = (value: string) => {
  try {
    return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

watch(messages, async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
})

onMounted(() => {
  connectSocket()
  attachSocketListeners()
  if (socket.value) {
    socket.value.on('chat:user-typing', (payload: { isTyping: boolean; roomId?: string }) => {
      if (room.value?._id && payload?.roomId && payload.roomId !== room.value._id) return
      isTyping.value = payload?.isTyping || false
    })
  }
})

onBeforeUnmount(() => {
  detachSocketListeners()
  if (socket.value) {
    socket.value.off('chat:user-typing')
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
