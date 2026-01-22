import { useUser } from "@/composables/modules/auth/user"
export default defineNuxtRouteMiddleware((to, from) => {
  const { token } = useUser()
  
  if (!token.value) {
    return navigateTo('/')
  }
})