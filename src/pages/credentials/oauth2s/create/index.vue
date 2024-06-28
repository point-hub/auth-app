<script setup lang="ts">
import { AxiosError } from 'axios'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast-store'

import CardApplication from '../components/card-application.vue'
import CardAuthorizedUrls from '../components/card-authorized-urls.vue'
import CardRedirectUrls from '../components/card-redirect-urls.vue'
import type { IAuthorizedUrl, IRedirectUrl } from '../types'
import CardBreadcrumbs from './card-breadcrumbs.vue'
import { useForm } from './form'

const router = useRouter()
const { toastRef } = useToastStore()
const form = reactive(useForm())

const authorizedUrls = ref<IAuthorizedUrl[]>([])
const redirectUrls = ref<IRedirectUrl[]>([])

const showApiKeyModal = ref(false)
const toggleCredentialInfo = (value: boolean) => {
  let newValue = !showApiKeyModal.value
  if (value === true) newValue = true
  if (value === false) newValue = false
  showApiKeyModal.value = newValue
}

const generatedClientId = ref()
const generatedClientSecret = ref()

const onSave = async () => {
  // convert web authorized javascript origins array
  form.data.authorized_javascript_origins = authorizedUrls.value.map(function (item) {
    return item['url']
  })

  // convert web authorized javascript urls array
  form.data.authorized_javascript_urls = redirectUrls.value.map(function (item) {
    return item['url']
  })

  try {
    const response = await axios.post('/v1/oauth2s', form.data)
    if (response.status === 201) {
      generatedClientId.value = response.data.client_id
      generatedClientSecret.value = response.data.client_secret
      toastRef.toast('Create success')
      toggleCredentialInfo(true)
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
  toggleCredentialInfo(false)
  router.push('/credentials/oauth2s')
}

const tooltipClientId = ref('copy')
const onCopyClientId = () => {
  navigator.clipboard.writeText(generatedClientId.value)
  tooltipClientId.value = 'copied!'
}

const tooltipClientSecret = ref('copy')
const onCopyClientSecret = () => {
  navigator.clipboard.writeText(generatedClientSecret.value)
  tooltipClientSecret.value = 'copied!'
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <card-breadcrumbs />

    <card-application v-model:name="form.data.name" :errors="form.errors" />

    <card-authorized-urls v-model:authorizedUrls="authorizedUrls" />

    <card-redirect-urls v-model:redirectUrls="redirectUrls" />

    <base-card>
      <div class="flex gap-2">
        <base-button color="primary" @click="onSave()">Save & Generate Key</base-button>
        <router-link to="/credentials/oauth2">
          <base-button color="danger">Cancel</base-button>
        </router-link>
      </div>
    </base-card>

    <!-- success confirmation, and inform user to save the api key -->
    <base-modal :is-open="showApiKeyModal" @on-close="onCloseCreatedModal()">
      <div class="max-h-90vh overflow-auto p-4">
        <h2 class="py-4 text-2xl font-bold">OAuth2 credential created</h2>
        <div class="space-y-8">
          <p>Make sure to copy your client secret now. You won't be able to see it again!</p>
          <div class="flex flex-col gap-2">
            <span class="font-semibold">Client Id</span>
            <div class="w-full border border-black flex items-center gap-2 py-2">
              <base-button size="sm" v-tooltip="tooltipClientId" @click="onCopyClientId">
                <base-icon icon="i-far-copy"></base-icon>
              </base-button>
              <div>{{ generatedClientId }}</div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <span class="font-semibold">Client Secret</span>
            <div class="w-full border border-black flex items-center gap-2 py-2">
              <base-button size="sm" v-tooltip="tooltipClientSecret" @click="onCopyClientSecret">
                <base-icon icon="i-far-copy"></base-icon>
              </base-button>
              <div>{{ generatedClientSecret }}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <base-button color="primary" size="sm" @click="toggleCredentialInfo(false)">
              Close
            </base-button>
          </div>
        </div>
      </div>
    </base-modal>
  </div>
</template>

<style scoped lang="postcss"></style>
