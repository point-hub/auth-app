<script setup lang="ts">
import { AxiosError } from 'axios'
import { reactive, ref } from 'vue'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast-store'

import CardAppDomain from './card-app-domain.vue'
import CardAppInformation from './card-app-information.vue'
import CardAppLogo from './card-app-logo.vue'
import CardAuthorizedDomain from './card-authorized-domain.vue'
import CardBreadcrumbs from './card-breadcrumbs.vue'
import { useForm } from './form'
import type { IAuthorizedDomain } from './types'

const { toastRef } = useToastStore()
const form = reactive(useForm())

const authorizedDomains = ref<IAuthorizedDomain[]>([])

const onSave = async () => {
  // convert authorized domains array
  form.data.authorized_domains = authorizedDomains.value.map(function (item) {
    return item['domain']
  })

  try {
    const response = await axios.post('/v1/api-keys', form.data)
    if (response.status === 201) {
      toastRef.toast('Create success')
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
        <base-button color="primary" @click="onSave()">Save</base-button>
        <router-link to="/credentials/api-keys">
          <base-button color="danger">Cancel</base-button>
        </router-link>
      </div>
    </base-card>
  </div>
</template>

<style scoped lang="postcss"></style>
