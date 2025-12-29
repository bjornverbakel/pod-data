<template>
  <v-card class="pa-6 pa-sm-8">
    <div class="section-spacing-sm">
      <v-card-title class="pa-0 text-truncate-wrap">Account</v-card-title>
      <v-card-text class="pa-0"> Update your profile information. </v-card-text>

      <UpdateProfileForm />

      <v-divider class="my-4" />

      <div class="text-h6">Change Password</div>
      <UpdatePasswordForm />
    </div>
  </v-card>
</template>
