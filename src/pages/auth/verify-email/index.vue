<script setup lang="ts">
import { BaseButton, BaseCard, BaseInput } from '@point-hub/papp'
import { AxiosError } from 'axios'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast-store'

import { useForm } from './form'

const { toastRef } = useToastStore()
const route = useRoute()

const form = reactive(useForm())
form.data.code = route.query.code?.toString() ?? ''

const onSubmit = async () => {
  try {
    await axios.post('/v1/auth/verify-email', {
      code: form.data.code
    })
    toastRef.toast('email verification success', { color: 'success' })
  } catch (error) {
    if (error instanceof AxiosError) {
      const errors = error?.response?.data?.errors
      if (errors) {
        for (const key in errors) {
          form.errors[key] = errors[key]
        }
      } else {
        toastRef.toast(error.response?.data?.message ?? error.message, { color: 'danger' })
      }
    }
  }
}
</script>

<template>
  <component :is="BaseCard" class="max-w-xl">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <component
          :is="BaseInput"
          v-model="form.data.code"
          :errors="form.errors.code"
          label="Code"
          layout="vertical"
        />
      </div>
      <component :is="BaseButton" type="submit" variant="fill" color="primary">
        Verify Email
      </component>
    </form>
  </component>
</template>
