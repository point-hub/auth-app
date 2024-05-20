import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast-store'

export function useDeleteApi() {
  const route = useRoute()
  const router = useRouter()
  const { toastRef } = useToastStore()

  // regenerate modal logic
  const showDeleteModalInfo = ref(false)
  const toggleDeleteModalInfo = (value: boolean) => {
    let newValue = !showDeleteModalInfo.value
    if (value === true) newValue = true
    if (value === false) newValue = false
    showDeleteModalInfo.value = newValue
  }

  const onDeleteLoadingState = ref(false)
  const onDelete = async () => {
    // prevent calling twice use loading state
    if (onDeleteLoadingState.value) return
    // start loading state
    onDeleteLoadingState.value = true
    // start api call
    const response = await axios.patch(`/v1/api-keys/${route.params.id}`)
    if (response.status === 200) {
      toastRef.toast(`Delete API key "${form.value.name}" success`)
      toggleDeleteModalInfo(false)
      router.push('/credentials/api-keys')
    }
    // stop loading state
    onDeleteLoadingState.value = false
  }

  return {
    showDeleteModalInfo,
    toggleDeleteModalInfo,
    onDeleteLoadingState,
    onDelete
  }
}
