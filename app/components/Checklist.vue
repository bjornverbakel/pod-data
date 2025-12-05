<template>
  <div class="section-spacing">
    <div>
      <h1 class="main-header">{{ title }}</h1>
      <h2 v-if="subtitle" class="sub-header mt-1">{{ subtitle }}</h2>
    </div>

    <div v-if="body" class="body-text mb-4">{{ body }}</div>

    <slot name="before-stats" />

    <AppAlert
      v-if="feedback.message"
      v-model:message="feedback.message"
      :type="feedback.type || 'error'"
      :closable="closable ?? false"
      @clear="$emit('update:feedback', { ...feedback, message: '' })"
    />

    <div class="font-mono text-uppercase">
      <div class="d-flex justify-space-between mb-1">
        <span v-if="loading">[STATUS: LOADING...]</span>

        <span v-else-if="$vuetify.display.smAndUp">
          [STATUS: {{ completionPercent >= 100 ? 'FINISHED' : 'IN_PROGRESS' }}]
        </span>

        <span>{{ completedCount }} / {{ props.items.length }}</span>
      </div>

      <v-progress-linear :model-value="completionPercent" color="primary" height="24">
        <template v-slot:default="{ value }">
          <span class="text-white"> {{ Math.ceil(value) }}% </span>
        </template>
      </v-progress-linear>
    </div>

    <div class="d-flex flex-column flex-sm-row ga-4 justify-space-between">
      <v-text-field
        v-model="search"
        variant="solo"
        flat
        label="Search"
        prepend-inner-icon="mdi-magnify"
        clearable
        hide-details
        density="comfortable"
        :max-width="$vuetify.display.smAndUp ? 300 : undefined"
      />
      <v-switch
        v-model="hideCompleted"
        color="info"
        label="Hide Completed"
        hide-details
        inset
        density="comfortable"
      />
    </div>

    <div v-if="groupBy && groupKeys.length > 0" class="d-flex flex-wrap ga-2 full-bleed-md">
      <v-chip
        class="text-caption min-w-min pr-1"
        size="small"
        variant="text"
        prepend-icon="mdi-filter-variant"
        color="medium-emphasis"
      >
        Types:
      </v-chip>
      <v-chip
        v-for="group in groupKeys"
        :key="group"
        size="small"
        :variant="activeGroup === group ? 'flat' : 'tonal'"
        :color="activeGroup === group ? 'primary' : 'medium-emphasis'"
        @click="toggleGroup(group)"
        class="text-caption min-w-min"
      >
        {{ group }}
        <v-icon
          v-if="activeGroup === group"
          end
          icon="mdi-close-circle"
          size="large"
          class="ml-1"
        ></v-icon>
      </v-chip>
    </div>

    <v-skeleton-loader v-if="loading" height="550" type="table" />

    <v-data-table-virtual
      v-else
      ref="tableRef"
      :headers="tableHeaders"
      :items="displayItems"
      :item-value="getItemKey"
      height="550"
      item-height="65"
      fixed-header
      hover
    >
      <template v-slot:item="{ item, index }">
        <tr
          :id="`checklist-item-${index}`"
          :class="['checklist-row', item._isGroupHeader ? 'bg-secondary' : '']"
          :style="item._isGroupHeader ? '' : 'cursor: pointer'"
          @click="!item._isGroupHeader && onToggle(item, !isCompleted(item))"
        >
          <template v-if="item._isGroupHeader">
            <td :colspan="tableHeaders.length" class="font-weight-bold text-on-secondary">
              {{ item.title }}
              <v-chip
                v-if="item.title === activeGroup"
                size="small"
                color="medium-emphasis"
                variant="text"
                class="ml-4"
                prepend-icon="mdi-filter-off-outline"
                @click.stop="toggleGroup(item.title)"
              >
                Remove Filter
              </v-chip>
            </td>
          </template>
          <template v-else>
            <td>
              <v-checkbox
                :model-value="isCompleted(item)"
                @update:model-value="val => onToggle(item, !!val)"
                hide-details
                @click.stop
              />
            </td>
            <td v-for="header in headers" :key="header.title">
              <slot v-if="header.slot" :name="header.slot" :item="item" />
              <template v-else>
                <!-- Special handling for Name column to show indentation for variants -->
                <div
                  v-if="header.key === 'name' && item.variant && hasBaseType(item)"
                  class="pl-4 text-medium-emphasis"
                >
                  <v-icon icon="mdi-subdirectory-arrow-right" size="small" class="mr-2" />
                  {{ item[header.key!] }}
                </div>
                <div v-else>
                  {{ item[header.key!] }}
                </div>
              </template>
            </td>
            <td>
              <v-chip
                v-if="item.guide_url"
                size="small"
                color="red"
                variant="flat"
                :href="item.guide_url"
                target="_blank"
                rel="noopener noreferrer"
                @click.stop
              >
                <v-avatar start class="bg-white">
                  <v-img src="/img/fextralife.jpg" class="pa-1" />
                </v-avatar>
                Fextralife
              </v-chip>
            </td>
          </template>
        </tr>
      </template>
    </v-data-table-virtual>
  </div>
</template>

<script setup lang="ts">
export interface Header {
  title: string
  width?: string
  key?: string
  slot?: string
}

const props = defineProps<{
  title: string
  subtitle?: string
  body?: string
  beforeStats?: string
  items: any[]
  loading: boolean
  feedback: { message: string; type: 'success' | 'error' | 'info' | 'warning' }
  headers: Header[]
  isCompleted: (item: any) => boolean
  onToggle: (item: any, completed: boolean) => void
  groupBy?: string
  groupOrder?: string[]
  closable?: boolean
}>()

defineEmits(['update:feedback'])

const tableHeaders = computed(() => [
  { title: 'Done', key: 'done', width: '1%', sortable: false },
  ...props.headers.map(h => ({ ...h, sortable: false })),
  { title: 'Guide', key: 'guide', width: '10%', sortable: false },
])

const completedCount = computed(() => {
  return props.items.reduce((count, item) => count + (props.isCompleted(item) ? 1 : 0), 0)
})

const completionPercent = computed(() => {
  const total = props.items.length
  if (!total) return 0
  return (completedCount.value / total) * 100
})

const search = ref('')
const hideCompleted = ref(false)
const activeGroup = ref<string | null>(null)

// 1. First filter layer: hide completed and search
const filteredItems = computed(() => {
  let items = props.items

  if (hideCompleted.value) {
    items = items.filter(item => !props.isCompleted(item))
  }

  if (search.value) {
    const lowerSearch = search.value.toLowerCase()
    items = items.filter(item => {
      return Object.values(item).some(
        val => typeof val === 'string' && val.toLowerCase().includes(lowerSearch)
      )
    })
  }

  return items
})

// 2. Determine available groups from filtered items
// BEFORE the activeGroup filter so the chips don't disappear when you select one
const groupKeys = computed(() => {
  if (!props.groupBy) return []

  // Extract unique groups from current filtered items
  const groups = new Set(filteredItems.value.map(item => item[props.groupBy!] || 'Other'))
  const keys = Array.from(groups)

  // Apply sorting
  if (props.groupOrder) {
    keys.sort((a, b) => {
      const indexA = props.groupOrder!.indexOf(a)
      const indexB = props.groupOrder!.indexOf(b)

      if (indexA !== -1 && indexB !== -1) return indexA - indexB
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      return a.localeCompare(b)
    })
  } else {
    keys.sort()
  }

  return keys
})

const getItemKey = (item: any) => {
  if (item._isGroupHeader) return `header-${item.title}`
  const groupKey = props.groupBy ? item[props.groupBy] : 'all'
  return `${groupKey}-${item.name}-${item.variant || 'base'}`
}

const hasBaseType = (item: any) => {
  const currentItems = filteredItems.value
  const group = currentItems.filter(
    i => (props.groupBy ? i[props.groupBy] === item[props.groupBy] : true) && i.name === item.name
  )
  return group.some(i => !i.variant)
}

// 3. Display items: Apply grouping and sorting
const displayItems = computed(() => {
  const items = filteredItems.value
  if (!props.groupBy) return items

  const groups: Record<string, any[]> = {}
  items.forEach(item => {
    const key = item[props.groupBy!] || 'Other'

    // IF activeGroup is set, only include items from that group
    if (activeGroup.value && key !== activeGroup.value) return

    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  })

  // Sort items within each group by name, then variant
  Object.values(groups).forEach(group => {
    group.sort((a, b) => {
      if (a.sort_order !== undefined && b.sort_order !== undefined) {
        return a.sort_order - b.sort_order
      }
      if (a.name === b.name) {
        if (!a.variant) return -1
        if (!b.variant) return 1
        return a.variant.localeCompare(b.variant)
      }
      return a.name.localeCompare(b.name)
    })
  })

  const result: any[] = []

  // Determine which group keys to include based on activeGroup
  const relevantKeys = groupKeys.value.filter(k => groups[k])

  relevantKeys.forEach(key => {
    result.push({ _isGroupHeader: true, title: key })
    const items = groups[key]
    if (items) {
      result.push(...items)
    }
  })
  return result
})

const tableRef = ref()

const toggleGroup = (group: string) => {
  if (activeGroup.value === group) {
    activeGroup.value = null // Toggle off
  } else {
    activeGroup.value = group // Toggle on

    // Reset table scroll to top when filtering
    if (tableRef.value && typeof tableRef.value.scrollToIndex === 'function') {
      tableRef.value.scrollToIndex(0)
    }
  }
}
</script>

<style scoped>
.checklist-row {
  scroll-margin-top: 56px;
}
</style>
