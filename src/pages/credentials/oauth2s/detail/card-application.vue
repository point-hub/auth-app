<script setup lang="ts">
import { onMounted, ref } from 'vue'

import axios from '@/axios'

import type { IFormError } from './form'

const emit = defineEmits(['regenerated'])

const formId = defineModel('formId')
const type = defineModel<string>('type')
const name = defineModel<string>('name')
const clientId = defineModel<string>('clientId')
const prefixClientSecret = defineModel<string>('prefixClientSecret')
const errors = defineModel<IFormError>('errors')

onMounted(() => {
  type.value = 'website'
})

// regenerate modal logic
const showRegenerateModalInfo = ref(false)
const toggleRegenerateModalInfo = (value: boolean) => {
  let newValue = !showRegenerateModalInfo.value
  if (value === true) newValue = true
  if (value === false) newValue = false
  showRegenerateModalInfo.value = newValue
}

const onRegenerateLoading = ref(false)
const onRegenerate = async () => {
  // prevent calling twice use loading state
  if (onRegenerateLoading.value) return
  // start loading state
  onRegenerateLoading.value = true
  // start api call
  const response = await axios.patch(`/v1/oauth2s/${formId.value}/regenerate`)
  if (response.status === 200) {
    emit('regenerated', response.data.client_secret)
    prefixClientSecret.value = response.data.prefix_client_secret
    toggleRegenerateModalInfo(false)
  }
  // stop loading state
  onRegenerateLoading.value = false
}
</script>

<template>
  <base-card>
    <template #header>OAuth2</template>
    <p>Request user consent so your app can access the user's data.</p>

    <div class="flex flex-col gap-4 mt-5">
      <base-form label="Application Type">Website</base-form>
      <base-input
        required
        v-model="name"
        label="Name"
        :errors="errors?.name"
        :helpers="[
          'The name of your OAuth 2.0 client. This name is only used to identify the client in the console and will not be shown to end users.'
        ]"
      />
      <base-form label="Client Id">{{ clientId }}</base-form>

      <base-form label="Client Secret">
        <div class="flex flex-wrap gap-4 w-full justify-between">
          <p>{{ prefixClientSecret }}******************************</p>
          <base-button color="primary" size="sm" @click="toggleRegenerateModalInfo(true)">
            Regenerate
          </base-button>
          <base-modal
            :is-open="showRegenerateModalInfo"
            @on-close="toggleRegenerateModalInfo(false)"
          >
            <div class="max-h-90vh overflow-auto p-4">
              <h2 class="py-4 text-2xl font-bold">Regenerate client secret</h2>
              <div class="space-y-8">
                <p>
                  Are you sure you want to regenerate this client secret? Any applications or
                  scripts using this client secret will no longer be able to access the Auth API.
                  You cannot undo this action.
                </p>
                <div class="flex gap-2">
                  <base-button
                    color="primary"
                    size="sm"
                    @click="onRegenerate()"
                    :disabled="onRegenerateLoading"
                  >
                    I Understand, Regenerate this client secret.
                  </base-button>
                  <base-button
                    color="secondary"
                    size="sm"
                    @click="toggleRegenerateModalInfo(false)"
                  >
                    Cancel
                  </base-button>
                </div>
              </div>
            </div>
          </base-modal>
        </div>
      </base-form>
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
