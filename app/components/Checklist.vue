<template>
  <div>
    <h1 class="main-header">{{ title }}</h1>
    <h2 v-if="subtitle" class="sub-header mt-1">{{ subtitle }}</h2>
  </div>

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

  <v-alert v-if="error" type="error">
    {{ error }}
  </v-alert>

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

  <v-skeleton-loader v-if="loading" height="550" type="table" />

  <v-data-table-virtual
    v-else
    :headers="tableHeaders"
    :items="displayItems"
    :item-value="getItemKey"
    height="550"
    item-height="60"
    fixed-header
    hover
  >
    <template v-slot:item="{ item }">
      <tr
        :class="item._isGroupHeader ? 'bg-secondary' : ''"
        :style="item._isGroupHeader ? '' : 'cursor: pointer'"
        @click="!item._isGroupHeader && onToggle(item, !isCompleted(item))"
      >
        <template v-if="item._isGroupHeader">
          <td :colspan="tableHeaders.length" class="font-weight-bold text-on-secondary">
            {{ item.title }}
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
              rel="noopener"
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
  items: any[]
  loading: boolean
  error: string
  headers: Header[]
  isCompleted: (item: any) => boolean
  onToggle: (item: any, completed: boolean) => void
  groupBy?: string
  groupOrder?: string[]
}>()

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

const getItemKey = (item: any) => {
  if (item._isGroupHeader) return `header-${item.title}`
  const groupKey = props.groupBy ? item[props.groupBy] : 'all'
  return `${groupKey}-${item.name}-${item.variant || 'base'}`
}

const hasBaseType = (item: any) => {
  // Check if there is another item in the same group with the same name but no variant
  const currentItems = filteredItems.value
  const group = currentItems.filter(
    i => (props.groupBy ? i[props.groupBy] === item[props.groupBy] : true) && i.name === item.name
  )
  return group.some(i => !i.variant)
}

const displayItems = computed(() => {
  const items = filteredItems.value
  if (!props.groupBy) return items

  const groups: Record<string, any[]> = {}
  items.forEach(item => {
    const key = item[props.groupBy!] || 'Other'
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  })

  // Sort items within each group by name, then variant
  Object.values(groups).forEach(group => {
    group.sort((a, b) => {
      // First sort by sort_order if available
      if (a.sort_order !== undefined && b.sort_order !== undefined) {
        return a.sort_order - b.sort_order
      }

      if (a.name === b.name) {
        // If names are same, sort by variant (nulls first)
        if (!a.variant) return -1
        if (!b.variant) return 1
        return a.variant.localeCompare(b.variant)
      }
      return a.name.localeCompare(b.name)
    })
  })

  const result: any[] = []
  const keys = Object.keys(groups)

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

  keys.forEach(key => {
    result.push({ _isGroupHeader: true, title: key })
    const items = groups[key]
    if (items) {
      result.push(...items)
    }
  })
  return result
})
</script>
