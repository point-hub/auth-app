<script setup lang="ts">
import { inject, onMounted, reactive, type Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { IToastRef } from '@/main-app.vue'
import { useAuthStore } from '@/stores/auth.store'
import { handleError } from '@/utils/api'

import { signinApiRequest } from './api/signin.api'
import { useForm } from './form'
import { usePassword } from './password'

const form = useForm()
const password = reactive(usePassword())
const router = useRouter()
const route = useRoute()
const redirectUrl = ref()
const toastRef = inject<Ref<IToastRef>>('toastRef')
const authStore = useAuthStore()

onMounted(() => {
  redirectUrl.value = route.query.redirect_url
})

const isLoading = ref(false)
const onSubmit = async () => {
  try {
    isLoading.value = true
    const response = await signinApiRequest(form.data.value)
    if (response.status === 200) {
      authStore.update(response.data)
      router.push('/')
    }
  } catch (error) {
    const errorResponse = handleError(error)
    if (errorResponse.errors) {
      form.errors.value.username = errorResponse.errors.username || []
      form.errors.value.password = errorResponse.errors.password || []
      return
    }
    if (errorResponse.message) {
      toastRef?.value.toast(errorResponse.message, {
        lists: errorResponse.lists,
        color: 'danger',
        timer: 5000
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <base-card class="max-w-xl">
    <div v-if="false">
      <base-loader v-if="isLoading" type="classic" sample="2">Loading...</base-loader>
      <!-- You can’t sign in because this app sent an invalid request. You can try again later, or
      contact the developer about this issue. -->
    </div>
    <form v-else @submit.prevent="onSubmit" class="flex flex-col gap-8 relative">
      <div class="flex flex-col gap-4">
        <div class="-mt-4">
          <h3 class="font-semibold">Sign in with Pointhub</h3>
          to continue to <a href="#" target="_blank" class="text-blue-600">Pointhub Auth Service</a>
        </div>

        <div class="flex flex-col gap-4">
          <base-input
            required
            autofocus
            :disabled="isLoading"
            v-model="form.data.value.username"
            :errors="form.errors.value.username"
            label="Username / Email"
            layout="vertical"
          />
          <base-input
            required
            :disabled="isLoading"
            :type="password.type"
            v-model="form.data.value.password"
            :errors="form.errors.value.password"
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
            <base-checkbox
              v-model="form.data.value.remember_me"
              text="Remember Me"
              :disabled="isLoading"
            />
            <router-link to="/forgot-password">Forgot Password</router-link>
          </div>
          <div>
            <base-button type="submit" is-block :is-loading="isLoading" color="primary">
              Sign In
            </base-button>
            <base-divider orientation="vertical" text="or continue with" />
            <div class="flex justify-between gap-2">
              <base-button type="button" variant="outline" class="shadow w-full">
                <img
                  src="@/assets/images/continue-with/google.svg"
                  alt="Continue with Google"
                  class="h-6"
                />
                Sign in with Google
              </base-button>
              <base-button type="button" variant="outline" class="shadow w-full">
                <img
                  src="@/assets/images/continue-with/github.svg"
                  alt="Continue with Github"
                  class="h-6"
                />
                Sign in with Github
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </base-card>
</template>

<style scoped lang="postcss"></style>
