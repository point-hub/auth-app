<script setup lang="ts">
import { BaseButton, BaseCard, BaseInput } from '@point-hub/papp'
import { AxiosError } from 'axios'
import { reactive } from 'vue'

import axios from '@/axios'

import { useForm } from './form'

const form = reactive(useForm())

const onSubmit = async () => {
  try {
    console.log(form.data.email)
    const response = await axios.post('/v1/auth/request-password', {
      email: form.data.email
    })
    console.log('submit', response.data)
  } catch (error) {
    if (error instanceof AxiosError) {
      const errors = error?.response?.data?.errors
      if (errors) {
        for (const key in errors) {
          form.errors[key] = errors[key]
        }
      } else {
        // toastRef.toast(error.message, { color: 'danger' })
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
          v-model="form.data.email"
          :errors="form.errors.email"
          label="Email"
          layout="vertical"
        />
      </div>
      <component :is="BaseButton" type="submit" variant="fill" color="primary">
        Request Reset Password
      </component>
    </form>
    <div class="mt-4">Remember Password ? <router-link to="/auth/signin">Sign In</router-link></div>
  </component>
</template>

<style scoped lang="postcss"></style>
