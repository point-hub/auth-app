<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { onMounted, ref, watch } from 'vue'

import { useToastStore } from '@/stores/toast-store'

import type { IRedirectUrl } from '../types'
import UrlExample from './url-example.vue'

const { toastRef } = useToastStore()
const updateIndex = ref(-1)
const redirectUrlInput = ref<string>('')
const redirectUrlPlaceholder = ref<string>('')
const redirectUrlInputRef = ref()
const redirectUrls = defineModel<IRedirectUrl[]>('redirectUrls', {
  required: true
})
const searchText = ref<string>('')
const filtered = ref()
const submitType = ref<'add' | 'update'>('add')

onMounted(() => {
  filtered.value = redirectUrls.value
})

watch(redirectUrls.value, () => {
  filtered.value = redirectUrls.value
})

const onSearch = () => {
  filtered.value = redirectUrls.value.filter((el: IRedirectUrl) => {
    return el.url.includes(searchText.value)
  })
}

const onSave = () => {
  for (const redirectUrl of redirectUrls.value) {
    if (redirectUrl.url === redirectUrlInput.value) {
      toastRef.toast(`Url "${redirectUrl.url}" is exists`, { color: 'danger' })
      return
    }
  }

  if (!redirectUrlInput.value) {
    toastRef.toast(`URL is required`, { color: 'danger' })
    return
  }

  submitType.value = 'add'

  if (updateIndex.value >= 0) {
    // update collection
    redirectUrls.value[updateIndex.value].url = redirectUrlInput.value
    updateIndex.value = -1
  } else {
    // add new collection
    redirectUrls.value.push({
      id: uuidv4(),
      url: redirectUrlInput.value
    })
  }

  // reset input text
  redirectUrlInput.value = ''

  // reset search text
  searchText.value = ''
}

const onUpdate = (redirectUrl: IRedirectUrl) => {
  submitType.value = 'update'
  redirectUrlPlaceholder.value = redirectUrl.url
  updateIndex.value = redirectUrls.value.indexOf(redirectUrl)
  redirectUrlInput.value = redirectUrl.url
  redirectUrlInputRef.value.inputRef.focus()
}

const onCancel = () => {
  submitType.value = 'add'
  updateIndex.value = -1
  redirectUrlInput.value = ''
}

const onDelete = (redirectUrl: IRedirectUrl) => {
  for (const [index, iterator] of redirectUrls.value.entries()) {
    if (iterator.id === redirectUrl.id) {
      submitType.value = 'add'
      searchText.value = ''
      updateIndex.value = -1
      redirectUrlInput.value = ''
      redirectUrlInputRef.value.inputRef.focus()
      redirectUrls.value.splice(index, 1)
      break
    }
  }
}
</script>

<template>
  <base-card>
    <template #header>Javascript redirect urls</template>
    <p>
      Specify one or more IP urles of the callers that are allowed to use your API key. Format as an
      IPv4. Examples: 192.168.0.1
    </p>
    <div class="flex flex-wrap gap-10 mt-5">
      <div>
        <url-example />
      </div>
      <div class="flex-1">
        <base-table v-if="redirectUrls.length">
          <thead>
            <tr>
              <th>
                <base-input
                  border="none"
                  placeholder="Search"
                  v-model="searchText"
                  @keyup="onSearch()"
                  class="font-light"
                >
                  <template #prefix>
                    <base-icon icon="i-far-magnifying-glass mr-1" />
                  </template>
                </base-input>
              </th>
              <th class="w-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="redirectUrl in filtered" :key="redirectUrl">
              <td>{{ redirectUrl.url }}</td>
              <td>
                <div class="flex">
                  <base-button size="sm" v-tooltip="'edit'" @click="onUpdate(redirectUrl)">
                    <base-icon icon="i-fad-pencil"></base-icon>
                  </base-button>
                  <base-button size="sm" v-tooltip="'delete'" @click="onDelete(redirectUrl)">
                    <base-icon icon="i-fad-trash"></base-icon>
                  </base-button>
                </div>
              </td>
            </tr>
          </tbody>
        </base-table>
        <form class="flex flex-col gap-4 mt-5" @submit.prevent="onSave">
          <base-input
            v-model="redirectUrlInput"
            type="url"
            ref="redirectUrlInputRef"
            required
            label="Redirect url"
          >
            <template #suffix>
              <div class="flex gap-1">
                <base-button type="submit" color="primary" variant="filled" size="xs">
                  {{ submitType === 'add' ? 'add' : 'update' }}
                </base-button>
                <base-button
                  v-if="submitType === 'update'"
                  @click="onCancel()"
                  type="button"
                  color="danger"
                  variant="filled"
                  size="xs"
                >
                  cancel
                </base-button>
              </div>
            </template>
          </base-input>
        </form>
      </div>
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
