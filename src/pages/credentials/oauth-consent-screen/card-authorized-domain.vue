<script setup lang="ts">
import { error } from 'console'
import { v4 as uuidv4 } from 'uuid'
import { onMounted, ref, watch } from 'vue'

import { useToastStore } from '@/stores/toast-store'

interface IWebRestriction {
  id: string
  url: string
}

const { toastRef } = useToastStore()
const updateIndex = ref(-1)
const authorizedDomainInput = ref<string>('')
const authorizedDomainPlaceholder = ref<string>('')
const authorizedDomainInputRef = ref()
const authorizedDomains = defineModel<IWebRestriction[]>('authorizedDomains', { required: true })
const searchText = ref<string>('')
const filtered = ref()
const submitType = ref<'add' | 'update'>('add')
const errors = ref<string[]>([])

onMounted(() => {
  filtered.value = authorizedDomains.value
})

watch(authorizedDomains.value, () => {
  filtered.value = authorizedDomains.value
})

watch(authorizedDomainInput, () => {
  errors.value = []
  if (
    authorizedDomainInput.value.includes('http://') ||
    authorizedDomainInput.value.includes('https://')
  ) {
    errors.value.push('Invalid domain: must not specify the scheme. (http:// or https://)')
  }
})

const onSearch = () => {
  filtered.value = authorizedDomains.value.filter((el: IWebRestriction) => {
    return el.url.includes(searchText.value)
  })
}

const onSave = () => {
  if (errors.value.length) {
    return
  }

  for (const authorizedDomain of authorizedDomains.value) {
    if (authorizedDomain.url === authorizedDomainInput.value) {
      toastRef.toast(`URL "${authorizedDomain.url}" is exists`, { color: 'danger' })
      return
    }
  }

  if (!authorizedDomainInput.value) {
    toastRef.toast(`URL is required`, { color: 'danger' })
    return
  }

  submitType.value = 'add'

  if (updateIndex.value >= 0) {
    // update collection
    authorizedDomains.value[updateIndex.value].url = authorizedDomainInput.value
    updateIndex.value = -1
  } else {
    // add new collection
    authorizedDomains.value.push({
      id: uuidv4(),
      url: authorizedDomainInput.value
    })
  }

  // reset input text
  authorizedDomainInput.value = ''

  // reset search text
  searchText.value = ''
}

const onUpdate = (authorizedDomain: IWebRestriction) => {
  submitType.value = 'update'
  authorizedDomainPlaceholder.value = authorizedDomain.url
  updateIndex.value = authorizedDomains.value.indexOf(authorizedDomain)
  authorizedDomainInput.value = authorizedDomain.url
  authorizedDomainInputRef.value.inputRef.focus()
}

const onCancel = () => {
  submitType.value = 'add'
  updateIndex.value = -1
  authorizedDomainInput.value = ''
}

const onDelete = (authorizedDomain: IWebRestriction) => {
  for (const [index, iterator] of authorizedDomains.value.entries()) {
    if (iterator.id === authorizedDomain.id) {
      submitType.value = 'add'
      searchText.value = ''
      updateIndex.value = -1
      authorizedDomainInput.value = ''
      authorizedDomainInputRef.value.inputRef.focus()
      authorizedDomains.value.splice(index, 1)
      break
    }
  }
}
</script>

<template>
  <base-card>
    <template #header>Authorized domains</template>
    <p>
      When a domain is used on the consent screen or in an OAuth client’s configuration, it must be
      pre-registered here.
    </p>
    <div class="flex flex-wrap gap-10 mt-5">
      <div class="flex-1">
        <base-table v-if="authorizedDomains.length">
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
            <tr v-for="authorizedDomain in filtered" :key="authorizedDomain.id">
              <td>{{ authorizedDomain.url }}</td>
              <td>
                <div class="flex">
                  <base-button size="sm" v-tooltip="'edit'" @click="onUpdate(authorizedDomain)">
                    <base-icon icon="i-fad-pencil"></base-icon>
                  </base-button>
                  <base-button size="sm" v-tooltip="'delete'" @click="onDelete(authorizedDomain)">
                    <base-icon icon="i-fad-trash"></base-icon>
                  </base-button>
                </div>
              </td>
            </tr>
          </tbody>
        </base-table>
        <form class="flex flex-col gap-4 mt-5" @submit.prevent="onSave">
          <base-input
            ref="authorizedDomainInputRef"
            type="text"
            required
            v-model="authorizedDomainInput"
            label="Website URL"
            :errors="errors"
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
