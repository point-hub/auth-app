<script setup lang="ts">
import { BaseButton, BaseCard, BaseCheckbox, BaseDivider, BaseInput } from '@point-hub/papp'
import { AxiosError } from 'axios'
import { reactive } from 'vue'

import { useForm } from './form'
import { usePassword } from './password'
import { useSigninApi } from './signin.api'

const form = reactive(useForm())
const password = reactive(usePassword())
const signinApi = useSigninApi()

const onSubmit = async () => {
  const response = await signinApi.send(form.data, form.errors)
  console.log(response)
}
</script>

<template>
  <component :is="BaseCard" class="max-w-xl">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-8">
      <div class="flex flex-col gap-4">
        <component
          :is="BaseInput"
          required
          v-model="form.data.username"
          :errors="form.errors.username"
          label="Username / Email"
          layout="vertical"
        />
        <component
          :is="BaseInput"
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
        </component>
        <div class="flex justify-between">
          <component :is="BaseCheckbox" v-model="form.data.rememberMe" text="Remember Me" />
          <router-link to="/auth/forgot-password" class="">Forgot Password</router-link>
        </div>
      </div>
      <div>
        <component :is="BaseButton" type="submit" variant="fill" is-block color="primary">
          Sign In
        </component>
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
  </component>
</template>

<style scoped lang="postcss"></style>
