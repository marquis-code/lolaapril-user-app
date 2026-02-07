<template>
  <section v-if="staff?.length" class="section staff-section">
    <div class="container">
      <h2 class="section-title">{{ title || 'Meet Our Team' }}</h2>
      <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>

      <div 
        class="staff-grid"
        :class="gridClass"
      >
        <div 
          v-for="member in staff" 
          :key="member.id || member._id || member.staffId"
          class="staff-card card"
        >
          <div class="staff-card__avatar">
            <img 
              v-if="member.profileImage || member.avatar || member.image" 
              :src="member.profileImage || member.avatar || member.image" 
              :alt="memberName(member)"
            />
            <div v-else class="staff-card__avatar-placeholder">
              {{ memberName(member)?.charAt(0) }}
            </div>
          </div>
          <div class="staff-card__info">
            <h4 class="staff-card__name">{{ memberName(member) }}</h4>
            <p v-if="member.title || member.role || member.specialization" class="staff-card__role">
              {{ member.title || member.role || member.specialization }}
            </p>
            <p v-if="config?.showBio && member.bio" class="staff-card__bio">
              {{ member.bio }}
            </p>
            <div v-if="config?.showRatings && member.rating?.average" class="staff-card__rating">
              ⭐ {{ member.rating.average }} ({{ member.rating.totalReviews || 0 }} reviews)
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  config?: any
  staff?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  staff: () => []
})

const gridClass = computed(() => {
  const cols = props.config?.columns || 4
  return `grid-cols-${cols}`
})

const memberName = (member: any) => {
  if (member.name) return member.name
  if (member.firstName) {
    return `${member.firstName} ${member.lastName || ''}`.trim()
  }
  return 'Team Member'
}
</script>

<style scoped>
.staff-section {
  background: #f9fafb;
}

.staff-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(1, 1fr);
}

.staff-grid.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.staff-grid.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.staff-grid.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1024px) {
  .staff-grid.grid-cols-3,
  .staff-grid.grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .staff-grid {
    grid-template-columns: 1fr !important;
  }
}

.staff-card {
  padding: 1.5rem;
  text-align: center;
  background: var(--color-card-background, #fff);
  border-radius: var(--card-radius, 12px);
  border: 1px solid var(--card-border-color, #e5e7eb);
}

.staff-card__avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
}

.staff-card__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.staff-card__avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: white;
  font-size: 2rem;
  font-weight: 600;
}

.staff-card__name {
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.staff-card__role {
  font-size: 0.875rem;
  color: var(--color-muted);
  margin-bottom: 0.5rem;
}

.staff-card__bio {
  font-size: 0.8125rem;
  color: var(--color-muted);
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.staff-card__rating {
  font-size: 0.8125rem;
  color: var(--color-text);
}
</style>
