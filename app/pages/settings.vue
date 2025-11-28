<template>
  <section class="section-spacing">
    <h1 class="main-header">Settings</h1>

    <v-card class="pa-0 pa-sm-8" :color="$vuetify.display.smAndUp ? undefined : 'background'">
      <div class="section-spacing-sm">
        <v-card-title class="pa-0 text-truncate-wrap">Data</v-card-title>
        <v-card-text class="pa-0">
          Export your completion data to a JSON file, or import data from a previously exported
          file. This allows you to backup your progress or transfer it to another account.
        </v-card-text>

        <v-btn
          color="primary"
          prepend-icon="mdi-download"
          :loading="exporting"
          @click="handleExport"
          class="w-fit"
          variant="flat"
        >
          Export Data
        </v-btn>

        <v-divider class="my-4" />

        <div class="d-flex align-start ga-4">
          <v-file-input
            v-model="importFile"
            label="Import Data (JSON)"
            accept=".json"
            prepend-icon="mdi-upload"
            :loading="importing"
            :error-messages="error"
            show-size
            hide-details
          />

          <v-btn
            :disabled="!canImport"
            :loading="importing"
            @click="handleImport"
            height="56"
            variant="plain"
          >
            Import
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

    <v-card
      v-if="!isAnonymous && user"
      class="pa-0 pa-sm-8 mt-8"
      :color="$vuetify.display.smAndUp ? undefined : 'background'"
    >
      <div class="section-spacing-sm">
        <v-card-title class="pa-0 text-truncate-wrap">Account</v-card-title>
        <v-card-text class="pa-0"> Update your profile information. </v-card-text>

        <UpdateProfileForm />

        <v-divider class="my-4" />

        <div class="text-h6">Change Password</div>
        <UpdatePasswordForm />
      </div>
    </v-card>
  </section>
</template>

<script setup lang="ts">
import UpdatePasswordForm from '~/components/auth/UpdatePasswordForm.vue'
import UpdateProfileForm from '~/components/auth/UpdateProfileForm.vue'

useHead({
  title: 'Settings',
})

const { exportData, importData } = useDataManagement()
const { isAnonymous } = useAuth()
const user = useSupabaseUser()

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
