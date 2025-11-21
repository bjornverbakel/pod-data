<template>
  <h1 class="main-header">{{ title }}</h1>

  <v-alert v-if="error" type="error" class="mb-4">
    {{ error }}
  </v-alert>

  <v-skeleton-loader v-if="loading" type="table" />

  <v-table hover fixedHeader height="600" v-else>
    <thead>
      <tr>
        <th width="1%">Done</th>
        <th v-for="header in headers" :key="header.title" :width="header.width">
          {{ header.title }}
        </th>
        <th width="10%">Guide</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in items"
        :key="item.id"
        @click="onToggle(item, !isCompleted(item))"
        style="cursor: pointer"
      >
        <td>
          <v-checkbox
            :model-value="isCompleted(item)"
            @update:model-value="val => onToggle(item, !!val)"
            hide-details
          />
        </td>
        <td v-for="header in headers" :key="header.title">
          <slot v-if="header.slot" :name="header.slot" :item="item" />
          <template v-else>
            {{ item[header.key!] }}
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
      </tr>
    </tbody>
  </v-table>
</template>

<script setup lang="ts">
export interface Header {
  title: string
  width?: string
  key?: string
  slot?: string
}

defineProps<{
  title: string
  items: any[]
  loading: boolean
  error: string
  headers: Header[]
  isCompleted: (item: any) => boolean
  onToggle: (item: any, completed: boolean) => void
}>()
</script>
