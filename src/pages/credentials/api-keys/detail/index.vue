<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast-store'

import CardIpAddressRestrictions from '../components/card-ip-address-restrictions.vue'
import DeleteModal from '../components/delete-modal.vue'
import type { IIpAddressRestriction, IWebRestriction } from '../types'
import CardApiKeys from './card-api-keys.vue'
import CardBreadcrumbs from './card-breadcrumbs.vue'
import CardWebRestrictions from './card-web-restrictions.vue'

const route = useRoute()
const router = useRouter()
const { toastRef } = useToastStore()
const deleteModalRef = ref()

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
const webRestrictions = ref<IWebRestriction[]>([])
const ipAddressRestrictions = ref<IIpAddressRestriction[]>([])

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
const onDelete = async () => {
  router.push('/credentials/api-keys')
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
        <base-button
          color="danger"
          @click="
            deleteModalRef.toggleModal(true, {
              id: route.params.id.toString(),
              name: form.name
            })
          "
        >
          Delete
        </base-button>
      </div>
    </base-card>

    <delete-modal ref="deleteModalRef" @deleted="onDelete" />
  </div>
</template>
