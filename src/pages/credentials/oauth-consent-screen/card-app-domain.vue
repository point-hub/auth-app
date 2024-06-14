<script setup lang="ts">
import type { IFormError } from './form'

const homepage = defineModel<string>('homepage')
const privacyPolicy = defineModel<string>('privacyPolicy')
const termsOfService = defineModel<string>('termsOfService')
const errors = defineModel<IFormError>('errors')
</script>

<template>
  <base-card>
    <template #header>App Domain</template>
    <p>
      To protect you and your users, Google only allows apps using OAuth to use Authorized Domains.
      The following information will be shown to your users on the consent screen.
    </p>

    <div class="flex flex-col gap-4 mt-5">
      <base-input
        v-model="homepage"
        label="Homepage link"
        :errors="errors?.homepage"
        :helpers="['Provide users a link to your home page']"
      />
      <base-input
        v-model="privacyPolicy"
        label="Privacy policy link"
        :errors="errors?.privacyPolicy"
        :helpers="['Provide users a link to your public privacy policy']"
      />
      <base-input
        v-model="termsOfService"
        label="Terms of service link"
        :errors="errors?.termsOfService"
        :helpers="['Provide users a link to your public terms of service']"
      />
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
