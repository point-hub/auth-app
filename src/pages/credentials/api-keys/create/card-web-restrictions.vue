<script setup lang="ts">
import { ref } from 'vue'

import { useToastStore } from '@/stores/toast-store'

import WebRestrictionExample from './web-restrictions-example.vue'

const { toastRef } = useToastStore()
const updateIndex = ref(-1)
const webRestrictionInput = ref()
const webRestrictions = defineModel<string[]>('webRestrictions', { required: true })

const onSaveWebRestriction = () => {
  let isExists = false
  for (const webRestriction of webRestrictions.value) {
    if (webRestriction === webRestrictionInput.value) {
      isExists = true
      toastRef.toast('URL is exists', { color: 'danger' })
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

const onUpdateWebRestriction = (index: number, value: string) => {
  updateIndex.value = index
  webRestrictionInput.value = value
}

const onDeleteWebRestriction = (value: string) => {
  if (confirm(`are you sure want to delete ${value}`)) {
    for (const [index, iterator] of webRestrictions.value.entries()) {
      if (iterator === value) {
        webRestrictions.value.splice(index, 1)
        break
      }
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
    <div class="flex gap-10 mt-5">
      <div>
        <WebRestrictionExample></WebRestrictionExample>
      </div>
      <div class="flex-1">
        <base-table v-if="webRestrictions.length">
          <thead>
            <tr>
              <th>
                <base-input border="none" class="font-light" placeholder="Search" />
              </th>
              <th class="w-1"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(webRestriction, index) in webRestrictions" :key="webRestriction">
              <td>{{ webRestriction }}</td>
              <td>
                <div class="flex">
                  <base-button
                    size="sm"
                    v-tooltip="'edit'"
                    @click="onUpdateWebRestriction(index, webRestriction)"
                  >
                    <base-icon icon="i-fad-pencil"></base-icon>
                  </base-button>
                  <base-button
                    size="sm"
                    v-tooltip="'delete'"
                    @click="onDeleteWebRestriction(webRestriction)"
                  >
                    <base-icon icon="i-fad-trash"></base-icon>
                  </base-button>
                </div>
              </td>
            </tr>
          </tbody>
        </base-table>
        <form class="flex flex-col gap-4 mt-5" @submit.prevent="onSaveWebRestriction">
          <base-input type="url" v-model="webRestrictionInput" label="Website URL" required>
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
