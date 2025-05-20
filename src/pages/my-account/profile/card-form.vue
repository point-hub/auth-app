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
    form.data.value.username = response.username
    form.data.value.name = response.name
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
      form.errors.value.username = errorResponse.errors.username || []
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
    <template #header>Profile</template>

    <div class="flex flex-col gap-4 mt-5">
      <base-input
        layout="horizontal"
        label="Username"
        v-model="form.data.value.username"
        :errors="form.errors.value.username"
        required
      />
      <base-input
        layout="horizontal"
        label="Name"
        v-model="form.data.value.name"
        :errors="form.errors.value.name"
        required
      />
      <div class="flex gap-2 mt-5">
        <base-button size="xs" color="primary" @click="onUpdate">Update</base-button>
      </div>
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
