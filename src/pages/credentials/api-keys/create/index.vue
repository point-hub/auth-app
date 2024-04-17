<script setup lang="ts">
import { ref } from 'vue'
import CardApiKeys from './card-api-keys.vue'
import CardWebRestrictions from './card-web-restrictions.vue'
import CardIpAddressRestrictions from './card-ip-address-restrictions.vue'
import CardBreadcrumbs from './card-breadcrumbs.vue'

const form = ref<{
  name: string
  web_restrictions: string[]
  ip_address_restrictions: string[]
}>({
  name: '',
  web_restrictions: [],
  ip_address_restrictions: []
})

const onSave = () => {}
const onCancel = () => {}
</script>

<template>
  <div class="flex flex-col gap-4">
    <card-breadcrumbs />

    <card-api-keys v-model:name="form.name" />

    <card-web-restrictions v-model:webRestrictions="form.web_restrictions" />

    <card-ip-address-restrictions v-model:ipAddressRestrictions="form.ip_address_restrictions" />

    <base-card>
      <div class="flex gap-2">
        <base-button color="primary" @click="onSave()">Save & Generate Key</base-button>
        <router-link to="/">
          <base-button color="danger">Cancel</base-button>
        </router-link>
      </div>
    </base-card>
  </div>
</template>

<style scoped lang="postcss"></style>
