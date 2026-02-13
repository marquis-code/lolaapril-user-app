// ─── composables/useReviews.ts ────────────────────────────────────────────────
// Nuxt 3 composable that wraps the GMB Reviews API factory with reactive state,
// pagination, and automatic token retrieval via useRuntimeConfig / useAuth.

import { ref, computed } from 'vue'
import { createReviewsApi } from '@/api_factory/modules/google-reviews'
import type { Review, ListReviewsParams, ReviewOrderBy } from '~/types/reviews'

// ── Shared helper to retrieve the OAuth access token ─────────────────────────
// Adjust this to wherever your app stores the token (Nuxt auth module, cookie,
// Pinia store, etc.).
function useAccessToken(): string {
  // ① Via nuxt/auth-utils  →  const { session } = useUserSession()
  // ② Via a Pinia store    →  const store = useAuthStore(); return store.token
  // ③ Via runtimeConfig    →  return useRuntimeConfig().gmbAccessToken
  //
  // Default: read from a cookie named "gmb_token"
  const token = useCookie<string>('gmb_token')
  if (!token.value) {
    throw new Error(
      '[useReviews] No access token found. Set the "gmb_token" cookie or ' +
      'customise the useAccessToken() helper in composables/useReviews.ts.',
    )
  }
  return token.value
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UseReviewsOptions {
  /** How many reviews to load per page (max 50, default 10). */
  pageSize?: number
  /** Initial sort order. */
  orderBy?: ReviewOrderBy
}

export interface UseReviewsReturn {
  // State
  reviews: ReturnType<typeof ref<Review[]>>
  averageRating: ReturnType<typeof ref<number>>
  totalReviewCount: ReturnType<typeof ref<number>>
  pending: ReturnType<typeof ref<boolean>>
  error: ReturnType<typeof ref<Error | null>>

  // Pagination
  hasNextPage: ReturnType<typeof computed<boolean>>
  currentOrderBy: ReturnType<typeof ref<ReviewOrderBy>>

  // Actions
  fetchPage(params?: ListReviewsParams): Promise<void>
  nextPage(): Promise<void>
  refresh(): Promise<void>
  changeOrder(order: ReviewOrderBy): Promise<void>
}

// ── Composable ────────────────────────────────────────────────────────────────

/**
 * @param parent   Full GMB resource name: "accounts/{accountId}/locations/{locationId}"
 * @param options  Optional config (pageSize, orderBy)
 *
 * @example
 * const {
 *   reviews, averageRating, totalReviewCount,
 *   pending, error, hasNextPage,
 *   nextPage, refresh, changeOrder,
 * } = useReviews('accounts/123456789/locations/987654321')
 */
export function useReviews(
  parent: string,
  options: UseReviewsOptions = {},
): UseReviewsReturn {
  const { pageSize = 10, orderBy: initialOrder = 'updateTime desc' } = options

  // ── Reactive state ──────────────────────────────────────────────────────────
  const reviews = ref<Review[]>([])
  const averageRating = ref<number>(0)
  const totalReviewCount = ref<number>(0)
  const pending = ref<boolean>(false)
  const error = ref<Error | null>(null)
  const nextPageToken = ref<string | undefined>(undefined)
  const currentOrderBy = ref<ReviewOrderBy>(initialOrder)

  // ── Derived state ───────────────────────────────────────────────────────────
  const hasNextPage = computed(() => !!nextPageToken.value)

  // ── Internal helpers ────────────────────────────────────────────────────────
  function getApi() {
    const accessToken = useAccessToken()
    return createReviewsApi({ accessToken })
  }

  // ── fetchPage ───────────────────────────────────────────────────────────────
  /**
   * Fetch a specific page. Pass `pageToken` to load a subsequent page,
   * or omit it to load from the first page (also resets existing reviews).
   */
  async function fetchPage(params: ListReviewsParams = {}): Promise<void> {
    pending.value = true
    error.value = null

    try {
      const api = getApi()
      const isFirstPage = !params.pageToken

      const response = await api.list(parent, {
        pageSize,
        orderBy: currentOrderBy.value,
        ...params,
      })

      // Reset on first page load; append on subsequent pages
      if (isFirstPage) {
        reviews.value = response.reviews ?? []
      } else {
        reviews.value = [...reviews.value, ...(response.reviews ?? [])]
      }

      averageRating.value = response.averageRating ?? 0
      totalReviewCount.value = response.totalReviewCount ?? 0
      nextPageToken.value = response.nextPageToken
    } catch (err) {
      error.value = err as Error
      console.error('[useReviews] fetchPage failed:', err)
    } finally {
      pending.value = false
    }
  }

  // ── nextPage ────────────────────────────────────────────────────────────────
  /** Append the next page of reviews to the current list. */
  async function nextPage(): Promise<void> {
    if (!hasNextPage.value) return
    await fetchPage({ pageToken: nextPageToken.value })
  }

  // ── refresh ─────────────────────────────────────────────────────────────────
  /** Reset pagination and reload from the first page. */
  async function refresh(): Promise<void> {
    nextPageToken.value = undefined
    await fetchPage()
  }

  // ── changeOrder ─────────────────────────────────────────────────────────────
  /** Change sort order and reload from page 1. */
  async function changeOrder(order: ReviewOrderBy): Promise<void> {
    currentOrderBy.value = order
    await refresh()
  }

  // ── Auto-fetch on mount ─────────────────────────────────────────────────────
  // Nuxt's callOnce / onMounted equivalent – works server & client.
  if (import.meta.server || import.meta.client) {
    fetchPage()
  }

  return {
    // State
    reviews,
    averageRating,
    totalReviewCount,
    pending,
    error,
    // Pagination
    hasNextPage,
    currentOrderBy,
    // Actions
    fetchPage,
    nextPage,
    refresh,
    changeOrder,
  }
}