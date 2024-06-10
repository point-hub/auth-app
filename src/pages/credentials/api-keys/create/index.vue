<script setup lang="ts">
import { AxiosError } from 'axios'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast-store'

import CardIpAddressRestrictions from '../components/card-ip-address-restrictions.vue'
import CardWebRestrictions from '../components/card-web-restrictions.vue'
import type { IIpAddressRestriction, IWebRestriction } from '../types'
import CardApiKeys from './card-api-keys.vue'
import CardBreadcrumbs from './card-breadcrumbs.vue'
import { useForm } from './form'

const router = useRouter()
const { toastRef } = useToastStore()
const form = reactive(useForm())

const webRestrictions = ref<IWebRestriction[]>([])
const ipAddressRestrictions = ref<IIpAddressRestriction[]>([])

const showApiKeyModal = ref(false)
const toggleApiKeyModal = (value: boolean) => {
  let newValue = !showApiKeyModal.value
  if (value === true) newValue = true
  if (value === false) newValue = false
  showApiKeyModal.value = newValue
}

const onSave = async () => {
  // convert web restrictions array
  form.data.web_restrictions = webRestrictions.value.map(function (item) {
    return item['url']
  })

  // convert ip address restrictions array
  form.data.ip_address_restrictions = ipAddressRestrictions.value.map(function (item) {
    return item['address']
  })

  try {
    const response = await axios.post('/v1/api-keys', form.data)
    if (response.status === 201) {
      toastRef.toast('Create success')
      showApiKeyModal.value = true
      router.push('/credentials/api-keys')
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
      console.log(listErrors)
      toastRef.toast(error.response?.data.message, {
        lists: listErrors.flat(),
        color: 'danger'
      })
    }
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <card-breadcrumbs />

    <card-api-keys v-model:name="form.data.name" :errors="form.errors" />

    <card-web-restrictions v-model:webRestrictions="webRestrictions" />

    <card-ip-address-restrictions v-model:ipAddressRestrictions="ipAddressRestrictions" />

    <base-card>
      <div class="flex gap-2">
        <base-button color="primary" @click="onSave()">Save & Generate Key</base-button>
        <router-link to="/credentials/api-keys">
          <base-button color="danger">Cancel</base-button>
        </router-link>
      </div>
    </base-card>

    <!-- success confirmation, and inform user to save the api key -->
    <base-modal :is-open="showApiKeyModal" @on-close="toggleApiKeyModal(false)">
      <div class="max-h-90vh overflow-auto p-4">
        <h2 class="py-4 text-2xl font-bold">Regenerate API Key</h2>
        <div class="space-y-8">
          <p>
            Are you sure you want to regenerate this API Key? Any applications or scripts using this
            API Key will no longer be able to access the Auth API. You cannot undo this action.
          </p>
          <div class="flex gap-2">
            <base-button color="primary" size="sm" @click="toggleApiKeyModal(false)">
              I Understand, Regenerate this API Key.
            </base-button>
          </div>
        </div>
      </div>
    </base-modal>
  </div>
</template>

<style scoped lang="postcss"></style>
