<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast-store'

const router = useRouter()
const { toastRef } = useToastStore()

const id = defineModel('id')
const name = defineModel('name')
const emit = defineEmits(['deleted'])

// regenerate modal logic
interface IData {
  id: string
  name: string
}
const showDeleteModalInfo = ref(false)
const toggleDeleteModalInfo = (state?: boolean, data?: IData) => {
  if (data) {
    id.value = data.id
    name.value = data.name
  }
  let newValue = !showDeleteModalInfo.value
  if (state === true) newValue = true
  if (state === false) newValue = false
  showDeleteModalInfo.value = newValue
}

const onDeleteLoading = ref(false)
const onDelete = async () => {
  // prevent calling twice use loading state
  if (onDeleteLoading.value) return
  // start loading state
  onDeleteLoading.value = true
  // start api call
  const response = await axios.delete(`/v1/api-keys/${id.value}`)
  if (response.status === 200) {
    emit('deleted')
    toastRef.toast(`Delete API key "${name.value}" success`)
    toggleDeleteModalInfo(false)
    router.push('/credentials/api-keys')
  }
  // stop loading state
  onDeleteLoading.value = false
}

defineExpose({
  showDeleteModalInfo,
  toggleDeleteModalInfo,
  id,
  name
})
</script>

<template>
  <base-modal :is-open="showDeleteModalInfo" @on-close="toggleDeleteModalInfo(false)">
    <div class="max-h-90vh overflow-auto p-4">
      <h2 class="py-4 text-2xl font-bold">Delete API Key</h2>
      <div class="space-y-8">
        <p>
          Are you sure you want to delete this API Key? Any applications or scripts using this API
          Key will no longer be able to access the Auth API. You cannot undo this action.
        </p>
        <div class="flex gap-2">
          <base-button color="danger" size="sm" @click="onDelete()" :disabled="onDeleteLoading">
            I Understand, Delete this API Key.
          </base-button>
          <base-button color="secondary" size="sm" @click="toggleDeleteModalInfo(false)">
            Cancel
          </base-button>
        </div>
      </div>
    </div>
  </base-modal>
</template>
