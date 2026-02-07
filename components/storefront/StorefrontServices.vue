<template>
  <section id="services" class="section services-section">
    <div class="container">
      <h2 class="section-title">{{ title || 'Our Services' }}</h2>
      <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>

      <!-- Category Filter - Only show categories that have services -->
      <div v-if="config?.showFilters && categoriesWithServices?.length > 1" class="category-filters">
        <button 
          class="category-filter"
          :class="{ active: !activeCategory }"
          @click="activeCategory = null"
        >
          All
        </button>
        <button 
          v-for="cat in categoriesWithServices" 
          :key="getCatId(cat)"
          class="category-filter"
          :class="{ active: activeCategory === getCatId(cat) }"
          @click="activeCategory = getCatId(cat)"
        >
          {{ cat.categoryName || cat.name }}
        </button>
      </div>

      <!-- Services by Category - Only render categories that have services -->
      <template v-if="shouldGroupByCategory">
        <div 
          v-for="category in displayCategories"
          :key="getCatId(category)"
          class="category-group"
        >
          <h3 
            class="category-title" 
            :style="{ color: category.appointmentColor || 'var(--color-primary)' }"
          >
            {{ category.categoryName || category.name }}
          </h3>

          <div 
            class="services-grid"
            :style="{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }"
          >
            <StorefrontServiceCard 
              v-for="service in getServicesForCategory(getCatId(category))"
              :key="service.id || service._id"
              :service="service"
              :config="config"
              @select="handleSelect"
            />
          </div>
        </div>

        <!-- Show message if no categories have services -->
        <p v-if="!displayCategories.length" class="no-services">
          No services available at the moment.
        </p>
      </template>

      <!-- Flat Grid (no grouping) -->
      <template v-else>
        <div 
          v-if="filteredServices.length" 
          class="services-grid"
          :style="{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }"
        >
          <StorefrontServiceCard 
            v-for="service in filteredServices"
            :key="service.id || service._id"
            :service="service"
            :config="config"
            @select="handleSelect"
          />
        </div>
        <p v-else class="no-services">
          No services available at the moment.
        </p>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  config?: any
  categories?: any[]
  services?: any[]
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  services: () => []
})

const emit = defineEmits(['select'])

const activeCategory = ref<string | null>(null)

// Helper to get category ID from a category object
const getCatId = (category: any): string => {
  return category?.id || category?._id || ''
}

// Helper to get category ID from a service's categoryId field
// categoryId can be a string OR an object with _id
const getServiceCategoryId = (service: any): string => {
  if (!service?.categoryId) return ''
  if (typeof service.categoryId === 'string') return service.categoryId
  if (typeof service.categoryId === 'object') return service.categoryId._id || service.categoryId.id || ''
  return ''
}

// Check if we should group by category
const shouldGroupByCategory = computed(() => {
  return props.config?.groupByCategory !== false
})

// Only categories that have at least one service
const categoriesWithServices = computed(() => {
  if (!props.categories?.length || !props.services?.length) return []
  
  return props.categories.filter((cat: any) => {
    const catId = getCatId(cat)
    if (!catId) return false
    return props.services.some((service: any) => getServiceCategoryId(service) === catId)
  })
})

// Categories to display (filtered by active category, but only those with services)
const displayCategories = computed(() => {
  if (!activeCategory.value) return categoriesWithServices.value
  return categoriesWithServices.value.filter((c: any) => getCatId(c) === activeCategory.value)
})

// Get services for a specific category
const getServicesForCategory = (categoryId: string): any[] => {
  if (!categoryId) return []
  return props.services.filter((service: any) => getServiceCategoryId(service) === categoryId)
}

// All filtered services (for flat grid or total count)
const filteredServices = computed(() => {
  if (!activeCategory.value) return props.services || []
  return props.services.filter((service: any) => getServiceCategoryId(service) === activeCategory.value)
})

// Grid columns config - use inline style for dynamic columns
const gridColumns = computed(() => {
  const cols = props.config?.columns || 3
  return cols
})

// Handle service selection
const handleSelect = (service: any) => {
  emit('select', service)
}
</script>

<style scoped>
.services-section {
  background: var(--color-background);
  padding: 4rem 0;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.category-filter {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #f3f4f6;
  color: #374151;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.category-filter:hover {
  background: #e5e7eb;
}

.category-filter.active {
  background: var(--color-primary);
  color: white;
}

.category-group {
  margin-bottom: 3rem;
}

.category-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.services-grid {
  display: grid;
  gap: 1.5rem;
  /* grid-template-columns is set via inline style */
}

/* Responsive: max 2 columns on tablets */
@media (max-width: 1024px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

/* Responsive: single column on mobile */
@media (max-width: 640px) {
  .services-grid {
    grid-template-columns: 1fr !important;
  }
}

.no-services {
  text-align: center;
  color: var(--color-muted);
  padding: 3rem 0;
}
</style>
