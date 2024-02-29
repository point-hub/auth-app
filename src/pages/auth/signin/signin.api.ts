import { AxiosError } from 'axios'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast-store'

const { toastRef } = useToastStore()

export function useSigninApi() {
  const send = async (data: any, errors: any) => {
    try {
      const response = await axios.post('/v1/auth/signin', {
        username: data.username,
        password: data.password,
        remember_me: data.rememberMe
      })
      toastRef.toast('Signin success', { color: 'success' })
      return response
    } catch (error) {
      if (error instanceof AxiosError) {
        const formErrors = error?.response?.data?.errors
        if (formErrors) {
          for (const key in formErrors) {
            errors[key] = formErrors[key]
          }
        } else {
          toastRef.toast(error.response?.data.message, { color: 'danger' })
        }
      }
    }
  }

  return { send }
}
