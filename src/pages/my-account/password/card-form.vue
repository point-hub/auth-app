<script setup lang="ts">
import { inject, reactive, type Ref, ref } from 'vue'

import type { IToastRef } from '@/main-app.vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import { handleError } from '@/utils/api.ts'

import { useForm } from './form.ts'
import { usePassword } from './password.ts'
import { useUpdatePasswordApi } from './update.api.ts'

const form = useForm()
const passwordStore = reactive(usePassword())

const toastRef = inject<Ref<IToastRef>>('toastRef')
const updatePasswordApi = useUpdatePasswordApi()
const authStore = useAuthStore()

const isSaving = ref(false)
const onUpdate = async () => {
  if ((form.errors.value.password?.length ?? 0) > 0) {
    return toastRef?.value.toast('Please use strong password', { color: 'danger' })
  }
  if (form.data.value.password !== form.data.value.confirm_password) {
    form.errors.value.confirm_password = ['Password do not match']
    return toastRef?.value.toast('Password confirmation not match', { color: 'danger' })
  }

  try {
    isSaving.value = true
    const response = await updatePasswordApi.send(authStore._id, form.data.value)
    if (response?.modified_count === 1) {
      form.reset()
      toastRef?.value.toast('Update success', { color: 'success' })
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
    isSaving.value = false
  }
}
</script>

<template>
  <base-card>
    <template #header>Update Password</template>

    <div class="flex flex-col gap-4 mt-5">
      <base-input
        label="Password"
        layout="horizontal"
        required
        :disabled="isSaving"
        :type="passwordStore.type"
        v-model="form.data.value.password"
        :errors="form.errors?.value.password"
        @keyup="form.validatePassword()"
        :reset-errors-on-update="false"
      >
        <template #suffix>
          <BaseButton @click="passwordStore.toggle" variant="text" color="secondary">
            <BaseIcon icon="i-far-eye" />
          </BaseButton>
        </template>
      </base-input>
      <base-input
        label="Password Confirmation"
        layout="horizontal"
        required
        :disabled="isSaving"
        :type="passwordStore.type"
        v-model="form.data.value.confirm_password"
        :errors="form.errors?.value.confirm_password"
        @keyup="form.validateConfirmationPassword()"
        :reset-errors-on-update="false"
      >
        <template #suffix>
          <BaseButton @click="passwordStore.toggle" variant="text" color="secondary">
            <BaseIcon icon="i-far-eye" />
          </BaseButton>
        </template>
      </base-input>

      <div class="flex gap-2 mt-10">
        <base-button :disabled="isSaving" size="xs" color="primary" @click="onUpdate">
          <template v-if="!isSaving">Update Password</template>
          <base-loader v-else type="classic" sample="2">Loading...</base-loader>
        </base-button>
      </div>
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
