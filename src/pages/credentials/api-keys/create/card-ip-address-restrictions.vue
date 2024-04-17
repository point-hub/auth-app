<script setup lang="ts">
import { ref } from 'vue'

import { useToastStore } from '@/stores/toast-store'

const { toastRef } = useToastStore()
const updateIndex = ref(-1)
const ipAddressInput = ref()
const ipAddressRestrictions = defineModel<string[]>('ipAddressRestrictions', { required: true })

const onSave = () => {
  let isExists = false
  for (const ipAddressRestriction of ipAddressRestrictions.value) {
    if (ipAddressRestriction === ipAddressInput.value) {
      isExists = true
      toastRef.toast('URL is exists', { color: 'danger' })
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
}

const onDelete = (value: string) => {
  if (confirm(`are you sure want to delete ${value}`)) {
    for (const [index, iterator] of ipAddressRestrictions.value.entries()) {
      if (iterator === value) {
        ipAddressRestrictions.value.splice(index, 1)
        break
      }
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
    <base-table v-if="ipAddressRestrictions.length">
      <thead>
        <tr>
          <th>
            <base-input border="none" class="font-light" placeholder="Search" />
          </th>
          <th class="w-1"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(ipAddressRestriction, index) in ipAddressRestrictions"
          :key="ipAddressRestriction"
        >
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
      <base-input v-model="ipAddressInput" label="IP Address" required>
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
