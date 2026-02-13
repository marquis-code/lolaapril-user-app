<script setup lang="ts">
// ─── pages/reviews.vue  (or any component) ───────────────────────────────────
// Replace the parent string with your real account/location resource name.
import { useReviews } from '@/composables/modules/reviews/useReviews'

const LOCATION = 'accounts/123456789/locations/987654321'

const {
  reviews,
  averageRating,
  totalReviewCount,
  pending,
  error,
  hasNextPage,
  currentOrderBy,
  nextPage,
  refresh,
  changeOrder,
} = useReviews(LOCATION, { pageSize: 10, orderBy: 'updateTime desc' })

// ── Helpers ───────────────────────────────────────────────────────────────────
const ORDER_OPTIONS = [
  { label: 'Newest first', value: 'updateTime desc' },
  { label: 'Highest rated', value: 'rating desc' },
  { label: 'Lowest rated', value: 'rating' },
] as const

/** Map "FOUR" → 4 so you can render star icons. */
function ratingToNumber(rating: string): number {
  const map: Record<string, number> = {
    ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
  }
  return map[rating] ?? 0
}
</script>

<template>
  <section class="reviews-page">
    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <header class="reviews-header">
      <div>
        <h1>Customer Reviews</h1>
        <p>
          <strong>{{ averageRating.toFixed(1) }} ★</strong>
          &nbsp;·&nbsp;
          {{ totalReviewCount }} review{{ totalReviewCount !== 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Sort control -->
      <select
        :value="currentOrderBy"
        @change="changeOrder(($event.target as HTMLSelectElement).value as any)"
      >
        <option
          v-for="opt in ORDER_OPTIONS"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>

      <button @click="refresh">↺ Refresh</button>
    </header>

    <!-- ── Error state ────────────────────────────────────────────────────── -->
    <div v-if="error" class="reviews-error">
      Failed to load reviews: {{ error.message }}
    </div>

    <!-- ── Loading skeleton ───────────────────────────────────────────────── -->
    <ul v-else-if="pending && reviews.length === 0" class="reviews-list">
      <li v-for="n in 3" :key="n" class="review-card review-card--skeleton" />
    </ul>

    <!-- ── Review list ────────────────────────────────────────────────────── -->
    <ul v-else class="reviews-list">
      <li
        v-for="review in reviews"
        :key="review.reviewId"
        class="review-card"
      >
        <div class="review-card__header">
          <img
            :src="review.reviewer.profilePhotoUrl"
            :alt="review.reviewer.displayName"
            class="review-card__avatar"
          />
          <div>
            <strong>{{ review.reviewer.displayName }}</strong>
            <time :datetime="review.createTime">
              {{ new Date(review.createTime).toLocaleDateString() }}
            </time>
          </div>
          <!-- Star rating -->
          <span class="review-card__stars">
            {{ '★'.repeat(ratingToNumber(review.starRating)) }}{{ '☆'.repeat(5 - ratingToNumber(review.starRating)) }}
          </span>
        </div>

        <p class="review-card__comment">{{ review.comment }}</p>

        <!-- Owner reply -->
        <blockquote v-if="review.reviewReply" class="review-card__reply">
          <strong>Owner reply:</strong> {{ review.reviewReply.comment }}
        </blockquote>
      </li>
    </ul>

    <!-- ── Load more ──────────────────────────────────────────────────────── -->
    <div class="reviews-footer">
      <button
        v-if="hasNextPage"
        :disabled="pending"
        @click="nextPage"
      >
        {{ pending ? 'Loading…' : 'Load more reviews' }}
      </button>
      <p v-else-if="reviews.length > 0">All reviews loaded.</p>
    </div>
  </section>
</template>