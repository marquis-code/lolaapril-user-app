// ─── Google My Business Reviews – Type Definitions ───────────────────────────

export type ReviewRating =
  | 'STAR_RATING_UNSPECIFIED'
  | 'ONE'
  | 'TWO'
  | 'THREE'
  | 'FOUR'
  | 'FIVE'

export type ReviewOrderBy = 'rating' | 'rating desc' | 'updateTime desc'

// ── Reviewer ──────────────────────────────────────────────────────────────────
export interface Reviewer {
  profilePhotoUrl: string
  displayName: string
  isAnonymous: boolean
}

// ── Review Reply ──────────────────────────────────────────────────────────────
export interface ReviewReply {
  comment: string
  updateTime: string // ISO 8601
}

// ── Review ────────────────────────────────────────────────────────────────────
export interface Review {
  name: string           // e.g. "accounts/*/locations/*/reviews/*"
  reviewId: string
  reviewer: Reviewer
  starRating: ReviewRating
  comment: string
  createTime: string     // ISO 8601
  updateTime: string     // ISO 8601
  reviewReply?: ReviewReply
}

// ── List Request Params ───────────────────────────────────────────────────────
export interface ListReviewsParams {
  pageSize?: number      // max 50
  pageToken?: string
  orderBy?: ReviewOrderBy
}

// ── List Response ─────────────────────────────────────────────────────────────
export interface ListReviewsResponse {
  reviews: Review[]
  averageRating: number
  totalReviewCount: number
  nextPageToken?: string
}