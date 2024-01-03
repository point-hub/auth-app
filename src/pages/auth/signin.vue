<script setup lang="ts">
import { BaseButton, BaseCard, BaseCheckbox, BaseInput } from '@point-hub/papp'
import { ref } from 'vue'

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
</script>

<template>
  <div class="flex flex-col gap-8 items-center justify-center h-screen container mx-auto">
    <img
      src="https://assets.pointhub.net/assets/images/logo/primary/logo.png"
      alt="pointhub-logo"
      class="max-w-xl h-12"
    />
    <component :is="BaseCard" class="max-w-xl">
      <form @submit.prevent="" class="flex flex-col gap-8">
        <div class="flex flex-col gap-4">
          <component
            :is="BaseInput"
            v-model="form.username"
            label="Username / Email"
            layout="vertical"
          />
          <component
            :is="BaseInput"
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
            <a href="#" class="">Forgot Password</a>
          </div>
        </div>
        <component :is="BaseButton" variant="fill">Sign Up</component>
      </form>
      <div class="mt-4">
        Don't have an account ? <router-link to="/auth/signup">Sign Up</router-link>
      </div>
    </component>
    <div class="flex gap-4">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
