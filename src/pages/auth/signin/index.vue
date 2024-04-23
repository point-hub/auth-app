<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useForm } from './form'
import { usePassword } from './password'
import { useSigninApi } from './signin.api'

const form = reactive(useForm())
const password = reactive(usePassword())
const signinApi = useSigninApi()
const router = useRouter()
const usernameRef = ref()

onMounted(() => {
  usernameRef.value.inputRef.focus()
})

const onSubmit = async () => {
  const response = await signinApi.send(form.data, form.errors)
  if (response) {
    router.push('/')
  }
}
</script>

<template>
  <base-card class="max-w-xl">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <base-input
          ref="usernameRef"
          required
          v-model="form.data.username"
          :errors="form.errors.username"
          label="Username / Email"
          layout="vertical"
        />
        <base-input
          required
          :type="password.type"
          v-model="form.data.password"
          :errors="form.errors.password"
          label="Password"
          layout="vertical"
        >
          <template #suffix>
            <BaseButton @click="password.toggle" variant="text" color="secondary">
              <BaseIcon icon="i-far-eye" />
            </BaseButton>
          </template>
        </base-input>
        <div class="flex justify-between">
          <base-checkbox v-model="form.data.rememberMe" text="Remember Me" />
          <router-link to="/auth/forgot-password">Forgot Password</router-link>
        </div>
      </div>
      <div>
        <base-button type="submit" is-block color="primary"> Sign In </base-button>
        <!-- <component :is="BaseDivider" orientation="vertical" text="or continue with" />
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
        </div> -->
      </div>
    </form>
    <div class="mt-8">
      Don't have an account ? <router-link to="/auth/signup">Sign Up</router-link>
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
