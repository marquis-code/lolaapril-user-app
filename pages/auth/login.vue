<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Or
        <NuxtLink to="/auth/register" class="font-medium text-primary hover:text-pink-500">
          start your 14-day free trial
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"> Email address </label>
            <div class="mt-1">
              <input 
                id="email" 
                name="email" 
                type="email" 
                v-model="form.email"
                required 
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
            <div class="mt-1">
              <input 
                id="password" 
                name="password" 
                type="password" 
                v-model="form.password"
                required 
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" 
              />
            </div>
          </div>

          <div v-if="error" class="text-red-500 text-sm">
            {{ error }}
          </div>

          <div>
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/modules/auth/useLogin'

const { login, loading, error } = useLogin()
const router = useRouter()
const route = useRoute()

const form = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  const success = await login(form)
  if (success) {
    error.value = 'Invalid email or password'
  }
}
</script>
