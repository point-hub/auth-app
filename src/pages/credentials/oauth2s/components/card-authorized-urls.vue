<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { onMounted, ref, watch } from 'vue'

import { useToastStore } from '@/stores/toast-store'

import type { IAuthorizedUrl } from '../types'
import UrlExample from './url-example.vue'

const { toastRef } = useToastStore()
const updateIndex = ref(-1)
const authorizedUrlInput = ref<string>('')
const authorizedUrlPlaceholder = ref<string>('')
const authorizedUrlInputRef = ref()
const authorizedUrls = defineModel<IAuthorizedUrl[]>('authorizedUrls', {
  required: true
})
const searchText = ref<string>('')
const filtered = ref()
const submitType = ref<'add' | 'update'>('add')

onMounted(() => {
  filtered.value = authorizedUrls.value
})

watch(authorizedUrls.value, () => {
  filtered.value = authorizedUrls.value
})

const onSearch = () => {
  filtered.value = authorizedUrls.value.filter((el: IAuthorizedUrl) => {
    return el.url.includes(searchText.value)
  })
}

const onSave = () => {
  for (const authorizedUrl of authorizedUrls.value) {
    if (authorizedUrl.url === authorizedUrlInput.value) {
      toastRef.toast(`URL "${authorizedUrl.url}" is exists`, { color: 'danger' })
      return
    }
  }

  if (!authorizedUrlInput.value) {
    toastRef.toast(`URL is required`, { color: 'danger' })
    return
  }

  submitType.value = 'add'

  if (updateIndex.value >= 0) {
    // update collection
    authorizedUrls.value[updateIndex.value].url = authorizedUrlInput.value
    updateIndex.value = -1
  } else {
    // add new collection
    authorizedUrls.value.push({
      id: uuidv4(),
      url: authorizedUrlInput.value
    })
  }

  // reset input text
  authorizedUrlInput.value = ''

  // reset search text
  searchText.value = ''
}

const onUpdate = (authorizedUrl: IAuthorizedUrl) => {
  submitType.value = 'update'
  authorizedUrlPlaceholder.value = authorizedUrl.url
  updateIndex.value = authorizedUrls.value.indexOf(authorizedUrl)
  authorizedUrlInput.value = authorizedUrl.url
  authorizedUrlInputRef.value.inputRef.focus()
}

const onCancel = () => {
  submitType.value = 'add'
  updateIndex.value = -1
  authorizedUrlInput.value = ''
}

const onDelete = (authorizedUrl: IAuthorizedUrl) => {
  for (const [index, iterator] of authorizedUrls.value.entries()) {
    if (iterator.id === authorizedUrl.id) {
      submitType.value = 'add'
      searchText.value = ''
      updateIndex.value = -1
      authorizedUrlInput.value = ''
      authorizedUrlInputRef.value.inputRef.focus()
      authorizedUrls.value.splice(index, 1)
      break
    }
  }
}
</script>

<template>
  <base-card>
    <template #header>Authorized javascript origins</template>
    <p>
      The HTTP origins that host your web application. This value can't contain wildcards or paths.
      If you use a port other than 80, you must specify it.
    </p>
    <div class="flex flex-wrap gap-10 mt-5">
      <div>
        <url-example />
      </div>
      <div class="flex-1">
        <base-table v-if="authorizedUrls.length">
          <thead>
            <tr>
              <th>
                <base-input
                  ref="searchRef"
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
            <tr v-for="authorizedUrl in filtered" :key="authorizedUrl.id">
              <td>{{ authorizedUrl.url }}</td>
              <td>
                <div class="flex">
                  <base-button size="sm" v-tooltip="'edit'" @click="onUpdate(authorizedUrl)">
                    <base-icon icon="i-fad-pencil"></base-icon>
                  </base-button>
                  <base-button size="sm" v-tooltip="'delete'" @click="onDelete(authorizedUrl)">
                    <base-icon icon="i-fad-trash"></base-icon>
                  </base-button>
                </div>
              </td>
            </tr>
          </tbody>
        </base-table>
        <form class="flex flex-col gap-4 mt-5" @submit.prevent="onSave">
          <base-input
            ref="authorizedUrlInputRef"
            type="url"
            required
            v-model="authorizedUrlInput"
            label="Authorized url"
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
