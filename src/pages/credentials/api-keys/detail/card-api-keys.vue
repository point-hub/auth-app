<script setup lang="ts">
import { ref } from 'vue'

import axios from '@/axios'

const formId = defineModel('formId')
const name = defineModel('name')
const prefixApiKey = defineModel('prefixApiKey')

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
  const response = await axios.patch(`/v1/api-keys/${formId.value}/regenerate`)
  if (response.status === 200) {
    prefixApiKey.value = response.data.prefix_api_key
    toggleRegenerateModalInfo(false)
  }
  // stop loading state
  onRegenerateLoading.value = false
}
</script>

<template>
  <base-card>
    <template #header>API Keys</template>
    <p>
      API key is a unique code that serves to provide login access and link code from one developer
      to another. As already explained, it is beneficial in the authentication process, notably when
      an API will be run by developers.
    </p>

    <div class="flex flex-col gap-4 mt-5">
      <base-input v-model="name" label="Name" />
      <base-form label="API Key">
        <div class="flex flex-wrap gap-4 w-full justify-between">
          <p>{{ prefixApiKey }}******************************</p>
          <base-button color="primary" size="sm" @click="toggleRegenerateModalInfo(true)">
            Regenerate
          </base-button>
          <base-modal
            :is-open="showRegenerateModalInfo"
            @on-close="toggleRegenerateModalInfo(false)"
          >
            <div class="max-h-90vh overflow-auto p-4">
              <h2 class="py-4 text-2xl font-bold">Regenerate API Key</h2>
              <div class="space-y-8">
                <p>
                  Are you sure you want to regenerate this API Key? Any applications or scripts
                  using this API Key will no longer be able to access the Auth API. You cannot undo
                  this action.
                </p>
                <div class="flex gap-2">
                  <base-button
                    color="primary"
                    size="sm"
                    @click="onRegenerate()"
                    :disabled="onRegenerateLoading"
                  >
                    I Understand, Regenerate this API Key.
                  </base-button>
                  <base-button color="danger" size="sm" @click="toggleRegenerateModalInfo(false)">
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
