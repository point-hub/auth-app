<script setup lang="ts">
import { ref, watch } from 'vue'

import { useToastStore } from '@/stores/toast-store'

import WebRestrictionExample from './web-restrictions-example.vue'

const { toastRef } = useToastStore()
const updateIndex = ref(-1)
const webRestrictionInput = ref()
const webRestrictionInputRef = ref()
const webRestrictions = defineModel<string[]>('webRestrictions', { required: true })
const searchText = ref()
const filtered = ref()

watch(
  webRestrictions,
  () => {
    filtered.value = webRestrictions.value
    searchText.value = ''
  },
  {
    deep: true,
    immediate: true
  }
)

const onSearch = () => {
  filtered.value = webRestrictions.value.filter((value: string) => {
    return value.includes(searchText.value)
  })
}

const onSave = () => {
  let isExists = false
  for (const webRestriction of webRestrictions.value) {
    if (webRestriction === webRestrictionInput.value) {
      isExists = true
      toastRef.toast(`URL "${webRestriction}" is exists`, { color: 'danger' })
      return
    }
  }

  if (updateIndex.value >= 0) {
    webRestrictions.value[updateIndex.value] = webRestrictionInput.value
    webRestrictionInput.value = ''
    updateIndex.value = -1
    return
  }

  if (!isExists) {
    webRestrictions.value.push(webRestrictionInput.value)
    webRestrictionInput.value = ''
  }
}

const onUpdate = (index: number, value: string) => {
  updateIndex.value = index
  webRestrictionInput.value = value
  webRestrictionInputRef.value.inputRef.focus()
}

const onDelete = (value: string) => {
  for (const [index, iterator] of webRestrictions.value.entries()) {
    if (iterator === value) {
      webRestrictions.value.splice(index, 1)
      break
    }
  }
}
</script>

<template>
  <base-card>
    <template #header>Website restrictions</template>
    <p>
      Restrict key usage requests to the specified websites. Here are some examples of URLs that you
      can allow to set up a website:
    </p>
    <div class="flex flex-wrap gap-10 mt-5">
      <div>
        <WebRestrictionExample></WebRestrictionExample>
      </div>
      <div class="flex-1">
        <base-table v-if="webRestrictions && webRestrictions.length">
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
            <tr v-for="(webRestriction, index) in filtered" :key="webRestriction">
              <td>{{ webRestriction }}</td>
              <td>
                <div class="flex">
                  <base-button
                    size="sm"
                    v-tooltip="'edit'"
                    @click="onUpdate(index, webRestriction)"
                  >
                    <base-icon icon="i-fad-pencil"></base-icon>
                  </base-button>
                  <base-button size="sm" v-tooltip="'delete'" @click="onDelete(webRestriction)">
                    <base-icon icon="i-fad-trash"></base-icon>
                  </base-button>
                </div>
              </td>
            </tr>
          </tbody>
        </base-table>
        <form class="flex flex-col gap-4 mt-5" @submit.prevent="onSave">
          <base-input
            ref="webRestrictionInputRef"
            type="url"
            required
            v-model="webRestrictionInput"
            label="Website URL"
          >
            <template #suffix>
              <base-button type="submit" color="primary" variant="text">
                <base-icon icon="i-far-plus" />
              </base-button>
            </template>
          </base-input>
        </form>
      </div>
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
