<template>
  <v-card class="pa-6 pa-sm-8" id="manage-completion-data">
    <div class="section-spacing-sm">
      <v-card-title class="pa-0 text-truncate-wrap">Manage Completion Data</v-card-title>
      <v-card-text class="pa-0">
        Export your completion data to a JSON file, or import data from a previously exported file.
        This allows you to backup your progress or transfer it to another account.
      </v-card-text>

      <v-btn
        color="primary"
        prepend-icon="mdi-download"
        :loading="exporting"
        @click="handleExport"
        class="w-fit"
        variant="flat"
      >
        <span class="text-truncate-wrap">Export Data</span>
      </v-btn>

      <v-divider class="my-4" />

      <div class="d-flex align-start flex-column flex-sm-row ga-4">
        <v-file-input
          v-model="importFile"
          label="Import Completion Data (.json)"
          accept=".json"
          prepend-icon="mdi-upload"
          :loading="importing"
          :error-messages="error"
          class="w-100"
          show-size
          hide-details
        />

        <v-btn
          :disabled="!canImport"
          :loading="importing"
          @click="handleImport"
          :height="$vuetify.display.smAndUp ? '56' : undefined"
          variant="flat"
          color="primary"
        >
          Import Data
        </v-btn>
      </div>

      <AppAlert
        v-if="successMessage"
        type="success"
        :message="successMessage"
        @clear="successMessage = ''"
      />
      <AppAlert v-if="error" type="error" :message="error" @clear="error = ''" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
const { exportData, importData } = useDataManagement()

const exporting = ref(false)
const importing = ref(false)
const importFile = ref<File[] | null>(null)
const error = ref('')
const successMessage = ref('')

const canImport = computed(() => {
  if (!importFile.value) return false
  if (Array.isArray(importFile.value)) return importFile.value.length > 0
  return !!importFile.value
})

const handleExport = async () => {
  exporting.value = true
  error.value = ''
  successMessage.value = ''
  try {
    await exportData()
    successMessage.value = 'Data exported successfully!'
  } catch (e: any) {
    error.value = e.message
  } finally {
    exporting.value = false
  }
}

const handleImport = async () => {
  const file = Array.isArray(importFile.value) ? importFile.value[0] : importFile.value
  if (!file) {
    error.value = 'Please select a file to import'
    return
  }

  importing.value = true
  error.value = ''
  successMessage.value = ''
  try {
    // v-file-input model is an array of files
    await importData(file)
    successMessage.value = 'Data imported successfully!'
    importFile.value = null
  } catch (e: any) {
    error.value = e.message
  } finally {
    importing.value = false
  }
}
</script>
