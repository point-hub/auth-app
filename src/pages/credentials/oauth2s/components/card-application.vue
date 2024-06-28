<script setup lang="ts">
import { onMounted } from 'vue'

import type { IFormError } from '../create/form'

const type = defineModel<string>('type')
const name = defineModel<string>('name')
const errors = defineModel<IFormError>('errors')

onMounted(() => {
  type.value = 'website'
})
</script>

<template>
  <base-card>
    <template #header>OAuth2</template>
    <p>Request user consent so your app can access the user's data.</p>

    <div class="flex flex-col gap-4 mt-5">
      <base-form label="Application Type">Website</base-form>
      <base-input
        v-model="name"
        label="Name"
        :errors="errors?.name"
        :helpers="[
          'The name of your OAuth 2.0 client. This name is only used to identify the client in the console and will not be shown to end users.'
        ]"
      />
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
