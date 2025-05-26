<script setup lang="ts">
import { inject, reactive, type Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { IToastRef } from '@/main-app.vue'
import { handleError } from '@/utils/api.ts'

import { resetPasswordApiRequest } from '../api/reset-password.api.ts'
import { useForm } from '../form.ts'
import { usePassword } from '../password.ts'

const route = useRoute()
const router = useRouter()
const form = useForm()
const passwordStore = reactive(usePassword())

const toastRef = inject<Ref<IToastRef>>('toastRef')

const isLoading = ref(false)
const onSubmit = async () => {
  try {
    isLoading.value = true

    if ((form.errors.value.password?.length ?? 0) > 0) {
      return toastRef?.value.toast('Please use strong password', { color: 'danger' })
    }
    if (form.data.value.password !== form.data.value.confirm_password) {
      form.errors.value.confirm_password = ['Password do not match']
      return toastRef?.value.toast('Password confirmation not match', { color: 'danger' })
    }

    const response = await resetPasswordApiRequest({
      code: route.params.id,
      password: form.data.value.password
    })
    if (response?.modified_count === 1) {
      form.reset()
      toastRef?.value.toast('Reset password success', { color: 'success' })
      router.push('/signin')
    }
  } catch (error) {
    const errorResponse = handleError(error)
    if (errorResponse.errors) {
      form.errors.value = {
        password: errorResponse.errors.password || [],
        confirm_password: errorResponse.errors.confirm_password || []
      }
    }
    if (errorResponse.message) {
      toastRef?.value.toast(errorResponse.message, {
        lists: errorResponse.lists,
        color: 'danger'
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <base-card class="max-w-xl">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <base-input
          label="New Password"
          layout="vertical"
          required
          :disabled="isLoading"
          :type="passwordStore.type"
          v-model="form.data.value.password"
          :errors="form.errors?.value.password"
          @keyup="form.validatePassword()"
          :reset-errors-on-update="false"
        >
          <template #suffix>
            <base-button @click="passwordStore.toggle" variant="text" color="secondary">
              <base-icon icon="i-far-eye" />
            </base-button>
          </template>
        </base-input>
        <base-input
          label="Password Confirmation"
          layout="vertical"
          required
          :disabled="isLoading"
          :type="passwordStore.type"
          v-model="form.data.value.confirm_password"
          :errors="form.errors?.value.confirm_password"
          @keyup="form.validateConfirmationPassword()"
          :reset-errors-on-update="false"
        >
          <template #suffix>
            <base-button @click="passwordStore.toggle" variant="text" color="secondary">
              <base-icon icon="i-far-eye" />
            </base-button>
          </template>
        </base-input>
      </div>
      <base-button :is-loading="isLoading" color="primary" @click="onSubmit">
        Reset Password
      </base-button>
    </form>
    <div class="mt-4">Remember your password? <router-link to="/signin">Sign In</router-link></div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
