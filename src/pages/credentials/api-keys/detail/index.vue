<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast-store'

import CardApiKeys from './card-api-keys.vue'
import CardBreadcrumbs from './card-breadcrumbs.vue'
import CardIpAddressRestrictions from './card-ip-address-restrictions.vue'
import CardWebRestrictions from './card-web-restrictions.vue'

const route = useRoute()
const router = useRouter()
const { toastRef } = useToastStore()

const form = ref<{
  name: string
  web_restrictions: string[]
  ip_address_restrictions: string[]
}>({
  name: '',
  web_restrictions: [],
  ip_address_restrictions: []
})

const formId = ref()
const prefixApiKey = ref()
const apiKeyResponse = ref()

onMounted(async () => {
  apiKeyResponse.value = (await axios.get(`/v1/api-keys/${route.params.id}`)).data
  formId.value = apiKeyResponse.value._id
  form.value.name = apiKeyResponse.value.name
  form.value.web_restrictions = apiKeyResponse.value.web_restrictions ?? []
  form.value.ip_address_restrictions = apiKeyResponse.value.ip_address_restrictions ?? []
  prefixApiKey.value = apiKeyResponse.value.prefix_api_key
})

const onUpdate = async () => {
  const response = await axios.patch(`/v1/api-keys/${route.params.id}`, form.value)
  if (response.status === 200) {
    toastRef.toast('Update success')
    router.push('/credentials/api-keys')
  }
}

// regenerate modal logic
const showDeleteModalInfo = ref(false)
const toggleDeleteModalInfo = (value: boolean) => {
  let newValue = !showDeleteModalInfo.value
  if (value === true) newValue = true
  if (value === false) newValue = false
  showDeleteModalInfo.value = newValue
}

const onDeleteLoading = ref(false)
const onDelete = async () => {
  // prevent calling twice use loading state
  if (onDeleteLoading.value) return
  // start loading state
  onDeleteLoading.value = true
  // start api call
  const response = await axios.patch(`/v1/api-keys/${route.params.id}`)
  if (response.status === 200) {
    toastRef.toast(`Delete API key "${form.value.name}" success`)
    toggleDeleteModalInfo(false)
    router.push('/credentials/api-keys')
  }
  // stop loading state
  onDeleteLoading.value = false
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <card-breadcrumbs :id="route.params.id.toString()" />
    <card-api-keys
      v-model:name="form.name"
      v-model:prefixApiKey="prefixApiKey"
      :form-id="route.params.id.toString()"
    />

    <card-web-restrictions v-model:webRestrictions="form.web_restrictions" />

    <card-ip-address-restrictions v-model:ipAddressRestrictions="form.ip_address_restrictions" />

    <base-card>
      <div class="flex gap-2">
        <base-button color="primary" @click="onUpdate()">Update</base-button>
        <base-button color="danger" @click="toggleDeleteModalInfo(true)">Delete</base-button>
        <base-modal :is-open="showDeleteModalInfo" @on-close="toggleDeleteModalInfo(false)">
          <div class="max-h-90vh overflow-auto p-4">
            <h2 class="py-4 text-2xl font-bold">Delete API Key</h2>
            <div class="space-y-8">
              <p>
                Are you sure you want to delete this API Key? Any applications or scripts using this
                API Key will no longer be able to access the Auth API. You cannot undo this action.
              </p>
              <div class="flex gap-2">
                <base-button
                  color="danger"
                  size="sm"
                  @click="onDelete()"
                  :disabled="onDeleteLoading"
                >
                  I Understand, Delete this API Key.
                </base-button>
                <base-button color="secondary" size="sm" @click="toggleDeleteModalInfo(false)">
                  Cancel
                </base-button>
              </div>
            </div>
          </div>
        </base-modal>
      </div>
    </base-card>
  </div>
</template>
