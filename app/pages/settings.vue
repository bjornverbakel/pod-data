<template>
  <v-dialog v-model="clearDataDialog" closeable max-width="500">
    <v-card>
      <v-card-title class="text-h6 text-truncate-wrap font-weight-bold"
        >Confirm Deletion</v-card-title
      >

      <v-divider />

      <v-card-text class="px-4">
        Are you sure you want to clear all your completion data? This action cannot be undone.
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="plain" class="border" @click="clearDataDialog = false">
          Cancel
        </v-btn>
        <v-btn color="error" variant="flat" @click="performClearData">Clear Data</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <div class="section-spacing">
    <h1 class="main-header">Settings</h1>

    <!-- Import Game Save -->
    <v-card class="pa-6 pa-sm-8" id="import-game-save">
      <div class="section-spacing-sm">
        <v-card-title class="pa-0 text-truncate-wrap">Import Game Save</v-card-title>
        <v-card-text class="pa-0">
          Import your NieR: Automata save file to automatically mark items as completed.
        </v-card-text>
        <v-card-text class="pa-0 text-error">
          <strong>Note:</strong> This feature is a WIP and currently only supports Pod Programs,
          Weapons, Archives, and Fish. If you have completion data manually entered, it's
          recommended to
          <a class="text-error" href="#" @click.prevent="scrollToManageData">export a backup</a>
          before proceeding. Some items may not be marked correctly. It is recommended to review
          your completion records after importing.
        </v-card-text>

        <v-expansion-panels variant="accordion" flat class="border-b font-base">
          <v-expansion-panel>
            <v-expansion-panel-title class="px-3">
              <v-icon icon="mdi-information-slab-circle" class="mr-4" />
              How to find and import your save file
            </v-expansion-panel-title>
            <v-expansion-panel-text class="px-0 text-body-2">
              <ol>
                <li>
                  Locate your NieR: Automata save file on your device (SlotData_0.dat). This is
                  typically found at:
                  <div class="d-flex ga-1 my-2 flex-wrap flex-sm-nowrap">
                    <code>C:\Users\[USERNAME]\Documents\My Games\NieR_Automata</code>
                    <v-btn
                      v-if="$vuetify.display.smAndUp"
                      variant="plain"
                      size="x-small"
                      :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
                      :color="copied ? 'success' : undefined"
                      @click="copy('C:\\Users\\[USERNAME]\\Documents\\My Games\\NieR_Automata')"
                    />
                    <v-btn
                      v-else
                      variant="plain"
                      size="small"
                      :prepend-icon="copied ? 'mdi-check' : 'mdi-content-copy'"
                      :color="copied ? 'success' : undefined"
                      class="mb-1"
                      @click="copy('C:\\Users\\[USERNAME]\\Documents\\My Games\\NieR_Automata')"
                    >
                      {{ copied ? 'Copied!' : 'Copy Path' }}
                    </v-btn>
                  </div>
                  <div class="my-2 d-flex flex-column ga-2">
                    <div class="d-flex align-start ga-2">
                      <span class="mt-1 font-weight-bold">-</span>
                      <div><code>SlotData_0.dat</code> = Save slot 1</div>
                    </div>

                    <div class="d-flex align-start ga-2">
                      <span class="mt-1 font-weight-bold">-</span>
                      <div><code>SlotData_1.dat</code> = Save slot 2</div>
                    </div>

                    <div class="d-flex align-start ga-2">
                      <span class="mt-1 font-weight-bold">-</span>
                      <div><code>SlotData_2.dat</code> = Save slot 3</div>
                    </div>
                  </div>
                </li>
                <li>
                  Make a copy of the save file and save it elsewhere. <strong>DO NOT</strong> modify
                  the actual save file in its original location. I am not responsible for any data
                  loss.
                </li>
                <li>Use the file input below to select and import the copied save file.</li>
              </ol>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <div class="d-flex align-start flex-column flex-sm-row ga-4 mt-2">
          <v-file-input
            v-model="saveFile"
            label="Import Save File (.dat)"
            accept=".dat"
            prepend-icon="mdi-content-save"
            :loading="saveImporting"
            :error-messages="saveError"
            class="w-100"
            show-size
            persistent-hint
            hint="Currently supports: Pod Programs, Weapons, Archives, Fish"
          />

          <v-btn
            :disabled="!canImportSave"
            :loading="saveImporting"
            @click="handleSaveImport"
            :height="$vuetify.display.smAndUp ? '56' : undefined"
            variant="flat"
            color="primary"
          >
            Import Save
          </v-btn>
          <DevOnly>
            <v-btn
              :disabled="!canImportSave"
              :loading="saveImporting"
              @click="handleSaveDebug"
              :height="$vuetify.display.smAndUp ? '56' : undefined"
              variant="outlined"
              color="primary"
            >
              Debug JSON
            </v-btn>
          </DevOnly>
        </div>

        <AppAlert
          v-if="saveSuccessMessage"
          type="success"
          :message="saveSuccessMessage"
          @clear="saveSuccessMessage = ''"
        />
        <AppAlert v-if="saveError" type="error" :message="saveError" @clear="saveError = ''" />
      </div>
    </v-card>

    <!-- Manage Completion Data -->
    <v-card class="pa-6 pa-sm-8" id="manage-completion-data">
      <div class="section-spacing-sm">
        <v-card-title class="pa-0 text-truncate-wrap">Manage Completion Data</v-card-title>
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

    <!-- Account Settings -->
    <v-card v-if="!isAnonymous && user" class="pa-6 pa-sm-8">
      <div class="section-spacing-sm">
        <v-card-title class="pa-0 text-truncate-wrap">Account</v-card-title>
        <v-card-text class="pa-0"> Update your profile information. </v-card-text>

        <UpdateProfileForm />

        <v-divider class="my-4" />

        <div class="text-h6">Change Password</div>
        <UpdatePasswordForm />
      </div>
    </v-card>

    <!-- Clear Data -->
    <v-card class="pa-6 pa-sm-8">
      <div class="section-spacing-sm">
        <v-card-title class="pa-0 text-truncate-wrap">Clear All Data</v-card-title>

        <v-card-text class="pa-0">
          This will clear all your completion data. This action is irreversible.
        </v-card-text>

        <v-btn
          color="error"
          prepend-icon="mdi-delete"
          class="w-fit"
          variant="flat"
          @click="confirmClearData"
        >
          Clear All Data
        </v-btn>

        <AppAlert
          v-if="deleteSuccess"
          type="success"
          :message="deleteSuccess"
          @clear="deleteSuccess = ''"
          class="mt-4"
        />
        <AppAlert
          v-if="deleteError"
          type="error"
          :message="deleteError"
          @clear="deleteError = ''"
          class="mt-4"
        />
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Settings',
})

const { exportData, importData, clearAllData } = useDataManagement()
const { isAnonymous } = useAuth()
const user = useSupabaseUser()

const exporting = ref(false)
const importing = ref(false)
const importFile = ref<File[] | null>(null)
const error = ref('')
const successMessage = ref('')
const deleteError = ref('')
const deleteSuccess = ref('')
const clearDataDialog = ref(false)

const { copied, copy } = useClipboard()

const {
  importSaveFile: importGameSave,
  downloadParsedSave,
  importing: saveImporting,
  error: saveError,
  successMessage: saveSuccessMessage,
} = useSaveImporter()
const saveFile = ref<File[] | null>(null)

const canImportSave = computed(() => {
  if (!saveFile.value) return false
  if (Array.isArray(saveFile.value)) return saveFile.value.length > 0
  return !!saveFile.value
})

const handleSaveImport = async () => {
  const file = Array.isArray(saveFile.value) ? saveFile.value[0] : saveFile.value
  if (!file) return

  await importGameSave(file)
  if (!saveError.value) {
    saveFile.value = null
  }
}

const handleSaveDebug = async () => {
  const file = Array.isArray(saveFile.value) ? saveFile.value[0] : saveFile.value
  if (!file) return

  await downloadParsedSave(file)
}

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

const confirmClearData = () => {
  clearDataDialog.value = true
}

const performClearData = async () => {
  clearDataDialog.value = false
  deleteError.value = ''
  deleteSuccess.value = ''

  try {
    await clearAllData()
    deleteSuccess.value = 'All data cleared successfully.'
  } catch (e: any) {
    deleteError.value = 'Failed to clear data: ' + e.message
  }
}

const scrollToManageData = () => {
  if (typeof document === 'undefined') return
  const el = document.getElementById('manage-completion-data')
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped lang="scss">
.v-expansion-panel:deep(.v-expansion-panel-text__wrapper) {
  @media (max-width: 600px) {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
