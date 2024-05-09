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

const onSave = async () => {
  const response = await axios.post('/v1/api-keys', form.value)
  if (response.status === 201) {
    toastRef.toast('Create success')
    router.push('/credentials/api-keys')
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <card-breadcrumbs :id="route.params.id.toString()" />

    <card-api-keys v-model:name="form.name" />

    <card-web-restrictions v-model:webRestrictions="form.web_restrictions" />

    <card-ip-address-restrictions v-model:ipAddressRestrictions="form.ip_address_restrictions" />

    <base-card>
      <div class="flex gap-2">
        <base-button color="primary" @click="onSave()">Save & Generate Key</base-button>
        <router-link to="/credentials/api-keys">
          <base-button color="danger">Cancel</base-button>
        </router-link>
      </div>
    </base-card>
  </div>
</template>

<style scoped lang="postcss"></style>
