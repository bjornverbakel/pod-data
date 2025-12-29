<template>
  <v-dialog v-model="clearDataDialog" closeable max-width="500">
    <v-card>
      <v-card-title class="text-h6 text-truncate-wrap">Confirm Deletion</v-card-title>

      <v-divider />

      <v-card-text class="px-4">
        Are you sure you want to clear all your completion data? This action is irreversible.
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

  <v-dialog v-model="deleteAccountDialog" closeable max-width="500">
    <v-card>
      <v-card-title class="text-h6 text-truncate-wrap">Confirm Account Deletion</v-card-title>

      <v-divider />

      <v-card-text class="px-4">
        Are you sure you want to delete your account? This action is irreversible.
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="plain" class="border" @click="deleteAccountDialog = false">
          Cancel
        </v-btn>
        <v-btn color="error" variant="flat" @click="performDeleteAccount">Delete Account</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card class="pa-6 pa-sm-8">
    <div class="section-spacing-sm">
      <v-card-title class="pa-0 text-truncate-wrap">Danger Zone</v-card-title>
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

      <v-divider class="my-4" />

      <v-card-title class="pa-0 text-truncate-wrap">Delete Account</v-card-title>

      <v-card-text class="pa-0">
        This will permanently delete your account and all associated data. This action is
        irreversible.
      </v-card-text>

      <v-btn
        color="error"
        prepend-icon="mdi-delete"
        class="w-fit"
        variant="flat"
        @click="deleteAccountDialog = true"
      >
        Delete Account
      </v-btn>

      <AppAlert
        v-if="accountDeleteError"
        type="error"
        :message="accountDeleteError"
        @clear="accountDeleteError = ''"
        class="mt-4"
      />
    </div>
  </v-card>
</template>

<script setup lang="ts">
const { clearAllData } = useDataManagement()
const { deleteAccount } = useAuth()

const deleteError = ref('')
const deleteSuccess = ref('')
const accountDeleteError = ref('')
const clearDataDialog = ref(false)
const deleteAccountDialog = ref(false)

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

const performDeleteAccount = async () => {
  deleteAccountDialog.value = false
  accountDeleteError.value = ''

  try {
    await deleteAccount()
  } catch (e: any) {
    accountDeleteError.value = 'Failed to delete account: ' + e.message
  }
}
</script>
