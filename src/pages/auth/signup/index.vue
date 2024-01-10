<script setup lang="ts">
import { BaseButton, BaseCard, BaseCheckbox, BaseInput } from '@point-hub/papp'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast-store'

import { useForm } from './form'
import { usePassword } from './password'

const { toastRef } = useToastStore()
const form = useForm()
const password = usePassword()

const onSubmit = async () => {
  if (form.data.value.errors.password.length !== 0) {
    return toastRef.toast('Please use strong password', { color: 'danger' })
  }
  if (!form.isPasswordConfirmed.value) {
    return toastRef.toast('Password confirmation not match', { color: 'danger' })
  }
  if (!form.data.value.acceptTerms) {
    return toastRef.toast('Please accept terms & privacy', { color: 'danger' })
  }

  try {
    const response = await axios.post('/v1/auth/signup', form.data.value)
    if (response.status === 201) {
      form.reset()
      toastRef.toast('Signup Success', { color: 'success' })
    }
  } catch (error: any) {
    const errors = error?.response?.data?.errors
    if (errors) {
      for (const key in errors) {
        form.data.value.errors[key] = errors[key]
      }
    }
    return toastRef.toast(error?.response?.data?.message, { color: 'danger' })
  }
}
</script>

<template>
  <component :is="BaseCard" class="max-w-xl">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <component
          :is="BaseInput"
          required
          label="Name"
          layout="vertical"
          v-model="form.data.value.name"
          :errors="form.data.value.errors.name"
        />
        <component
          :is="BaseInput"
          required
          label="Email"
          layout="vertical"
          v-model="form.data.value.email"
          :errors="form.data.value.errors.email"
        />
        <component
          :is="BaseInput"
          required
          label="Username"
          layout="vertical"
          v-model="form.data.value.username"
          :errors="form.data.value.errors.username"
          :helpers="['You can use this username for signin']"
        />
        <component
          :is="BaseInput"
          required
          label="Password"
          layout="vertical"
          :type="password.type.value"
          v-model="form.data.value.password"
          @keyup="form.passwordValidation()"
          :errors="form.data.value.errors.password"
        >
          <template #suffix>
            <BaseButton @click="password.toggle" variant="text" color="secondary">
              <BaseIcon icon="i-far-eye" />
            </BaseButton>
          </template>
        </component>
        <component
          :is="BaseInput"
          required
          label="Confirm Password"
          layout="vertical"
          :type="password.type.value"
          v-model="form.data.value.confirmPassword"
          @keyup="form.confirmPasswordValidation()"
          :errors="form.data.value.errors.confirmPassword"
        >
          <template #suffix>
            <BaseButton @click="password.toggle" variant="text" color="secondary">
              <BaseIcon icon="i-far-eye" />
            </BaseButton>
          </template>
        </component>
        <div class="flex items-center">
          <component :is="BaseCheckbox" v-model="form.data.value.acceptTerms" />
          <p>
            Accept <a href="https://pointhub.net/privacy" target="_blank">Privacy</a> &
            <a href="https://pointhub.net/terms" target="_blank">Terms</a>
          </p>
        </div>
      </div>
      <component :is="BaseButton" type="submit" variant="fill" color="primary">Sign Up</component>
    </form>
    <div class="mt-4">
      Already have an account ? <router-link to="/auth/signin">Sign In</router-link>
    </div>
  </component>
</template>
