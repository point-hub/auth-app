<script setup lang="ts">
import { AxiosError } from 'axios'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast-store'

import CardAppDomain from './card-app-domain.vue'
import CardAppInformation from './card-app-information.vue'
import CardAppLogo from './card-app-logo.vue'
import CardAuthorizedDomain from './card-authorized-domain.vue'
import CardBreadcrumbs from './card-breadcrumbs.vue'
import { useForm } from './form'
import type { IAuthorizedDomain } from './types'

const router = useRouter()
const { toastRef } = useToastStore()
const form = reactive(useForm())

const authorizedDomains = ref<IAuthorizedDomain[]>([])

const showApiKeyModal = ref(false)
const toggleApiKeyModal = (value: boolean) => {
  let newValue = !showApiKeyModal.value
  if (value === true) newValue = true
  if (value === false) newValue = false
  showApiKeyModal.value = newValue
}

const generatedApiKey = ref()
const onSave = async () => {
  // convert authorized domains array
  form.data.authorized_domains = authorizedDomains.value.map(function (item) {
    return item['domain']
  })

  try {
    const response = await axios.post('/v1/api-keys', form.data)
    if (response.status === 201) {
      generatedApiKey.value = response.data.api_key
      toastRef.toast('Create success')
      toggleApiKeyModal(true)
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const formErrors = error?.response?.data?.errors
      var listErrors: string[] = []
      if (formErrors) {
        for (const key in formErrors) {
          form.errors[key] = formErrors[key]
          listErrors.push(formErrors[key])
        }
      }
      toastRef.toast(error.response?.data.message, {
        lists: listErrors.flat(),
        color: 'danger'
      })
    }
  }
}

const onCloseCreatedModal = () => {
  toggleApiKeyModal(false)
  router.push('/credentials/api-keys')
}

const tooltip = ref('copy')
const onCopyApiKey = () => {
  navigator.clipboard.writeText(generatedApiKey.value)
  tooltip.value = 'copied!'
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <card-breadcrumbs />

    <card-app-information v-model:name="form.data.name" :errors="form.errors" />

    <card-app-logo v-model:name="form.data.logo" :errors="form.errors" />

    <card-app-domain v-model:name="form.data.name" :errors="form.errors" />

    <card-authorized-domain v-model:authorized-domains="authorizedDomains" />

    <base-card>
      <div class="flex gap-2">
        <base-button color="primary" @click="onSave()">Save & Generate Key</base-button>
        <router-link to="/credentials/api-keys">
          <base-button color="danger">Cancel</base-button>
        </router-link>
      </div>
    </base-card>

    <!-- success confirmation, and inform user to save the api key -->
    <base-modal :is-open="showApiKeyModal" @on-close="onCloseCreatedModal()">
      <div class="max-h-90vh overflow-auto p-4">
        <h2 class="py-4 text-2xl font-bold">API Key created</h2>
        <div class="space-y-8">
          <p>Make sure to copy your API Key now. You won't be able to see it again!</p>
          <div class="flex flex-col gap-2">
            <span class="font-semibold">Your API Key</span>
            <div class="w-full border border-black flex items-center gap-2 py-2">
              <base-button size="sm" v-tooltip="tooltip" @click="onCopyApiKey">
                <base-icon icon="i-far-copy"></base-icon>
              </base-button>
              <div>{{ generatedApiKey }}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <base-button color="primary" size="sm" @click="toggleApiKeyModal(false)">
              Close
            </base-button>
          </div>
        </div>
      </div>
    </base-modal>
  </div>
</template>

<style scoped lang="postcss"></style>
