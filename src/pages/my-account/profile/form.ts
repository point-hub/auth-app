import { ref } from 'vue'

export interface IForm {
  _id: string
  name: string
  username: string
  email: string
}

export interface IFormError {
  _id: string[]
  name: string[]
  username: string[]
  email: string[]
}

export function useForm() {
  const defaultForm: IForm = {
    _id: '',
    name: '',
    username: '',
    email: ''
  }

  const defaultFormError: IFormError = {
    _id: [],
    name: [],
    username: [],
    email: []
  }

  const data = ref<IForm>(defaultForm)

  const errors = ref<IFormError>(defaultFormError)

  const reset = () => {
    data.value = defaultForm
    errors.value = defaultFormError
  }

  return { data, errors, reset }
}
