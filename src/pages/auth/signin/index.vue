<script setup lang="ts">
import { BaseButton, BaseCard, BaseCheckbox, BaseDivider, BaseInput } from '@point-hub/papp'
import { ref } from 'vue'

import { useToastStore } from '@/stores/toast-store'

const { toastRef } = useToastStore()

const form = ref({
  username: '',
  password: '',
  checkbox: false
})

const passwordType = ref<'text' | 'password'>('password')

const toggleRevealPassword = () => {
  if (passwordType.value === 'password') {
    passwordType.value = 'text'
  } else {
    passwordType.value = 'password'
  }
}

const onSubmit = () => {
  console.log('submit')
  toastRef.toast(
    'Administrator: Your request has been submitted. Allow up to 48 hours for an update',
    {
      color: 'danger'
    }
  )
}
</script>

<template>
  <component :is="BaseCard" class="max-w-xl">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <component
          :is="BaseInput"
          required
          v-model="form.username"
          label="Username / Email"
          layout="vertical"
        />
        <component
          :is="BaseInput"
          required
          :type="passwordType"
          v-model="form.password"
          label="Password"
          layout="vertical"
        >
          <template #suffix>
            <BaseButton @click="toggleRevealPassword" variant="text" color="secondary">
              <BaseIcon icon="i-far-eye" />
            </BaseButton>
          </template>
        </component>
        <div class="flex justify-between">
          <component :is="BaseCheckbox" v-model="form.checkbox" text="Remember Me" />
          <router-link to="/auth/forgot-password" class="">Forgot Password</router-link>
        </div>
      </div>
      <div>
        <component :is="BaseButton" type="submit" variant="fill" is-block color="primary">
          Sign In
        </component>
        <component :is="BaseDivider" orientation="vertical" text="or continue with" />
        <div class="flex gap-2">
          <component :is="BaseButton" type="button" variant="outline" class="shadow">
            <img
              src="@/assets/images/continue-with/google.svg"
              alt="Continue with Google"
              class="h-6"
            />
          </component>
          <component :is="BaseButton" type="button" variant="outline" class="shadow">
            <img
              src="@/assets/images/continue-with/github.svg"
              alt="Continue with Github"
              class="h-6"
            />
          </component>
        </div>
      </div>
    </form>
    <div class="mt-8">
      Don't have an account ? <router-link to="/auth/signup">Sign Up</router-link>
    </div>
  </component>
</template>

<style scoped lang="postcss"></style>
