<script setup lang="ts">
import { inject, onMounted, type Ref } from 'vue'

import type { IToastRef } from '@/main-app.vue'
import { useAuthStore } from '@/stores/auth.store'
import { handleError } from '@/utils/api'

import { useForm } from './form'
import { retrieveUserApi } from './retrieve.api'
import { updateUserApi } from './update.api'

const authStore = useAuthStore()

const toastRef = inject<Ref<IToastRef>>('toastRef')
const form = useForm()

onMounted(async () => {
  const response = await retrieveUserApi(authStore._id)

  if (response) {
    form.data.value._id = response._id
    form.data.value.email = response.email
  }
})

const onUpdate = async () => {
  try {
    const response = await updateUserApi(form.data.value._id, form.data.value)
    if (response?.modified_count === 1) {
      toastRef?.value.toast('Update success', { color: 'success' })
    }
  } catch (error) {
    const errorResponse = handleError(error)
    if (errorResponse.errors) {
      form.errors.value.name = errorResponse.errors.name || []
    }
    if (errorResponse.message) {
      toastRef?.value.toast(errorResponse.message, {
        lists: errorResponse.lists,
        color: 'danger'
      })
    }
  }
}
</script>

<template>
  <base-card>
    <template #header>Email Account</template>

    <base-input
      layout="horizontal"
      label="Email"
      v-model="form.data.value.email"
      :errors="form.errors.value.email"
      placeholder="youremail@example.com"
      :helpers="[
        'Email verification needed to confirming that an email address provided is valid, active, and actually belongs to you.'
      ]"
    >
      <template #suffix>
        <base-button variant="text">Not Verified</base-button>
      </template>
    </base-input>

    <div class="flex gap-2 mt-5">
      <base-button size="xs" color="primary" @click="onUpdate">Update</base-button>
      <base-button size="xs" variant="filled" color="primary">
        <base-icon icon="i-far-envelope" />
        Send Email Verification
      </base-button>
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
