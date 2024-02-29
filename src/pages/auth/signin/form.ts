import { ref, watch } from 'vue'

interface IForm {
  [key: string]: any
  username: string
  password: string
  rememberMe: boolean
}

interface IFormError {
  [key: string]: string[]
  username: string[]
  password: string[]
  rememberMe: string[]
}

export function useForm() {
  const defaultForm: IForm = {
    username: '',
    password: '',
    rememberMe: false
  }

  const defaultFormError: IFormError = {
    username: [],
    password: [],
    rememberMe: []
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
