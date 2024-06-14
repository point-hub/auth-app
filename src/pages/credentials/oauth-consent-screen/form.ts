import { ref, watch } from 'vue'

export interface IForm {
  [key: string]: any
  name: string
  logo: string
  support_email: string
  developer_email: string
  authorized_domains: string[]
}

export interface IFormError {
  [key: string]: string[]
  name: string[]
  logo: string[]
  support_email: string[]
  developer_email: string[]
  authorized_domains: string[]
}

export function useForm() {
  const defaultForm: IForm = {
    name: '',
    support_email: '',
    developer_email: '',
    logo: '',
    authorized_domains: []
  }

  const defaultFormError: IFormError = {
    name: [],
    support_email: [],
    developer_email: [],
    logo: [],
    authorized_domains: []
  }

  const data = ref<IForm>(defaultForm)

  const errors = ref<IFormError>(defaultFormError)

  watch(
    () => {
      const array = []
      for (const key in data.value) {
        if (Object.prototype.hasOwnProperty.call(data.value, key)) {
          array.push(data.value[key])
        }
      }
      return array
    },
    (newValue, oldValue) => {
      for (let index = 0; index < newValue.length; index++) {
        if (newValue[index] !== oldValue[index]) {
          Object.keys(errors.value).forEach((key, i) => {
            if (index === i) {
              errors.value[key] = []
            }
          })
        }
      }
    }
  )

  const reset = () => {
    data.value = defaultForm
    errors.value = defaultFormError
  }

  return { data, errors, reset }
}
