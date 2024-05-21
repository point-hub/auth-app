<script setup lang="ts">
import { ref, watch } from 'vue'

import { useToastStore } from '@/stores/toast-store'

const { toastRef } = useToastStore()
const updateIndex = ref(-1)
const ipAddressInput = ref()
const ipAddressInputRef = ref()
const ipAddressRestrictions = defineModel<string[]>('ipAddressRestrictions', { required: true })
const searchText = ref()
const filtered = ref()

watch(
  ipAddressRestrictions,
  () => {
    filtered.value = ipAddressRestrictions.value
    searchText.value = ''
  },
  {
    deep: true,
    immediate: true
  }
)

const onSearch = () => {
  filtered.value = ipAddressRestrictions.value.filter((value: string) => {
    return value.includes(searchText.value)
  })
}

const onSave = () => {
  let isExists = false
  for (const ipAddressRestriction of ipAddressRestrictions.value) {
    if (ipAddressRestriction === ipAddressInput.value) {
      isExists = true
      toastRef.toast(`IP address "${ipAddressRestriction}" is exists`, { color: 'danger' })
      return
    }
  }

  if (updateIndex.value >= 0) {
    ipAddressRestrictions.value[updateIndex.value] = ipAddressInput.value
    ipAddressInput.value = ''
    updateIndex.value = -1
    return
  }

  if (!isExists) {
    ipAddressRestrictions.value.push(ipAddressInput.value)
    ipAddressInput.value = ''
  }
}

const onUpdate = (index: number, value: string) => {
  updateIndex.value = index
  ipAddressInput.value = value
  ipAddressInputRef.value.inputRef.focus()
}

const onDelete = (value: string) => {
  for (const [index, iterator] of ipAddressRestrictions.value.entries()) {
    if (iterator === value) {
      ipAddressRestrictions.value.splice(index, 1)
      break
    }
  }
}
</script>

<template>
  <base-card>
    <template #header>IP address restrictions</template>
    <p>
      Specify one or more IP addresses of the callers that are allowed to use your API key. Format
      as an IPv4. Examples: 192.168.0.1
    </p>
    <base-table v-if="ipAddressRestrictions && ipAddressRestrictions.length">
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
        <tr v-for="(ipAddressRestriction, index) in filtered" :key="ipAddressRestriction">
          <td>{{ ipAddressRestriction }}</td>
          <td>
            <div class="flex">
              <base-button
                size="sm"
                v-tooltip="'edit'"
                @click="onUpdate(index, ipAddressRestriction)"
              >
                <base-icon icon="i-fad-pencil"></base-icon>
              </base-button>
              <base-button size="sm" v-tooltip="'delete'" @click="onDelete(ipAddressRestriction)">
                <base-icon icon="i-fad-trash"></base-icon>
              </base-button>
            </div>
          </td>
        </tr>
      </tbody>
    </base-table>
    <form class="flex flex-col gap-4 mt-5" @submit.prevent="onSave">
      <base-input v-model="ipAddressInput" ref="ipAddressInputRef" required label="IP Address">
        <template #suffix>
          <base-button type="submit" color="primary" variant="text">
            <base-icon icon="i-far-plus" />
          </base-button>
        </template>
      </base-input>
    </form>
  </base-card>
</template>

<style scoped lang="postcss"></style>
