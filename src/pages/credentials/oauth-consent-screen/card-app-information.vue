<script setup lang="ts">
import type { IFormError } from './form'

const name = defineModel<string>('name')
const supportEmail = defineModel<string>('supportEmail')
const developerEmail = defineModel<string>('developerEmail')
const errors = defineModel<IFormError>('errors')
</script>

<template>
  <base-card>
    <template #header>App Information</template>
    <p>This shows in the consent screen, and helps end users know who you are and contact you</p>

    <div class="flex flex-col gap-4 mt-5">
      <base-input
        required
        v-model="name"
        label="App Name"
        :errors="errors?.name"
        :helpers="['The name of the app asking for consent']"
      />
      <base-input
        required
        v-model="supportEmail"
        label="User support email"
        :errors="errors?.supportEmail"
        :helpers="['For users to contact you with questions about their consent']"
      />
      <base-input
        required
        v-model="developerEmail"
        label="Developer email address"
        :errors="errors?.developerEmail"
        :helpers="[
          'These email addresses are for Pointhub to notify you about any changes to your project'
        ]"
      />
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
