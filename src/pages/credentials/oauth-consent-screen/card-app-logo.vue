<script setup lang="ts">
import type { IFormError } from './form'

const logo = defineModel<string>('logo')
const errors = defineModel<IFormError>('errors')
</script>

<template>
  <base-card>
    <template #header>App logo</template>
    <p>
      This is your logo. It helps people recognize your app and is displayed on the OAuth consent
      screen.
    </p>

    <div class="flex flex-col gap-4 mt-5">
      <base-file-upload
        v-model="logo"
        label="Logo"
        :errors="errors?.logo"
        :helpers="[
          'Upload an image, not larger than 1MB on the consent screen that will help users recognize your app. Allowed image formats are JPG, PNG, and BMP. Logos should be square and 120px by 120px for the best results.'
        ]"
      />
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
