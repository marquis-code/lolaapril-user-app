// ─── Google My Business Reviews – API Factory ────────────────────────────────
// Usage:
//   const api = createReviewsApi({ accessToken: 'ya29.xxx' })
//   const data = await api.list('accounts/123/locations/456', { pageSize: 10 })

import type {
  ListReviewsParams,
  ListReviewsResponse,
  Review,
} from '~/types/reviews'

const GMB_BASE_URL = 'https://mybusiness.googleapis.com/v4'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a query-string from an object, omitting undefined/null values. */
function toQueryString(params: Record<string, unknown>): string {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      qs.set(key, String(value))
    }
  }
  const str = qs.toString()
  return str ? `?${str}` : ''
}

/** Centralised fetch wrapper – throws a typed error on non-2xx responses. */
async function gmb$fetch<T>(url: string, accessToken: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw createGmbError(response.status, errorBody)
  }

  return response.json() as Promise<T>
}

export interface GmbApiError extends Error {
  status: number
  code: string
  details: unknown
}

function createGmbError(status: number, body: Record<string, unknown>): GmbApiError {
  const message =
    (body?.error as Record<string, unknown>)?.message as string
    ?? `Google My Business API error – HTTP ${status}`

  const err = new Error(message) as GmbApiError
  err.status = status
  err.code = String((body?.error as Record<string, unknown>)?.code ?? status)
  err.details = body
  return err
}

// ── Factory ───────────────────────────────────────────────────────────────────

export interface ReviewsApiOptions {
  /** A valid Google OAuth 2.0 access token with business.manage scope. */
  accessToken: string
}

export interface ReviewsApi {
  /**
   * Fetch a single page of reviews for the given location.
   *
   * @param parent  Full resource name: "accounts/{accountId}/locations/{locationId}"
   * @param params  Optional pagination / ordering params
   */
  list(parent: string, params?: ListReviewsParams): Promise<ListReviewsResponse>

  /**
   * Convenience helper – fetches ALL reviews by following nextPageToken
   * automatically. Use with caution on locations with many reviews.
   *
   * @param parent   Full resource name
   * @param pageSize Number of reviews per internal request (default: 50)
   */
  listAll(parent: string, pageSize?: number): Promise<Review[]>

  /**
   * Fetch a single review by its resource name.
   *
   * @param reviewName  Full resource: "accounts/{a}/locations/{l}/reviews/{r}"
   */
  get(reviewName: string): Promise<Review>
}

export function createReviewsApi({ accessToken }: ReviewsApiOptions): ReviewsApi {
  // ── list ──────────────────────────────────────────────────────────────────
  async function list(
    parent: string,
    params: ListReviewsParams = {},
  ): Promise<ListReviewsResponse> {
    const qs = toQueryString({
      pageSize: params.pageSize,
      pageToken: params.pageToken,
      orderBy: params.orderBy,
    })
    const url = `${GMB_BASE_URL}/${parent}/reviews${qs}`
    return gmb$fetch<ListReviewsResponse>(url, accessToken)
  }

  // ── listAll ───────────────────────────────────────────────────────────────
  async function listAll(parent: string, pageSize = 50): Promise<Review[]> {
    const allReviews: Review[] = []
    let pageToken: string | undefined

    do {
      const page = await list(parent, { pageSize, pageToken })
      allReviews.push(...(page.reviews ?? []))
      pageToken = page.nextPageToken
    } while (pageToken)

    return allReviews
  }

  // ── get ───────────────────────────────────────────────────────────────────
  async function get(reviewName: string): Promise<Review> {
    const url = `${GMB_BASE_URL}/${reviewName}`
    return gmb$fetch<Review>(url, accessToken)
  }

  return { list, listAll, get }
}