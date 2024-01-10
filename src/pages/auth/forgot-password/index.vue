<script setup lang="ts">
import { BaseButton, BaseCard, BaseCheckbox, BaseInput } from '@point-hub/papp'
import { ref } from 'vue'

const form = ref({
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  accept: false
})

const passwordType = ref<'text' | 'password'>('password')

const toggleRevealPassword = () => {
  if (passwordType.value === 'password') {
    passwordType.value = 'text'
  } else {
    passwordType.value = 'password'
  }
}
</script>

<template>
  <component :is="BaseCard" class="max-w-xl">
    <form @submit.prevent="" class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <component :is="BaseInput" v-model="form.email" label="Email" layout="vertical" />
      </div>
      <component :is="BaseButton" variant="fill" color="primary">Request Reset Password</component>
    </form>
    <div class="mt-4">Remember Password ? <router-link to="/auth/signin">Sign In</router-link></div>
  </component>
</template>

<style scoped lang="postcss"></style>
