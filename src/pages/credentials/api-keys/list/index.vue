<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import axios from '@/axios'

import CardBreadcrumbs from './card-breadcrumbs.vue'

const route = useRoute()
const router = useRouter()

// Table Header
const options = [
  { id: 1, label: 'Quality Control Specialist' },
  { id: 2, label: 'Desktop Support Technician' },
  { id: 3, label: 'Tax Accountant' }
]

const selected = ref()
const searchAll = ref('')
const search = ref<string[]>([])

watchDebounced(
  searchAll,
  async () => {
    // reset page 1
    pagination.value.page = 1
    // update url query params
    router.push({
      path: '/credentials/api-keys',
      query: {
        search: searchAll.value,
        page: pagination.value.page
      }
    })
    // call api
    await getApiKeys()
  },
  { debounce: 500, maxWait: 1000 }
)

// Section Pagination
const updateData = async () => {
  router.push({
    path: '/credentials/api-keys',
    query: {
      search: searchAll.value,
      page: pagination.value.page
    }
  })
  await getApiKeys()
}

const getApiKeys = async () => {
  const response = await axios.get('/v1/api-keys', {
    params: {
      filter: {
        search: searchAll.value
      },
      page: pagination.value.page
    }
  })
  apiKeys.value = response.data.data
  pagination.value = response.data.pagination
}

// Table Setting
const columns = ['', 'Name', 'Created Date', 'Api Key']

const apiKeys = ref()
const pagination = ref({
  page: 1,
  page_size: 10,
  total_document: 100
})
onMounted(async () => {
  searchAll.value = route.query.search?.toString() ?? ''
  pagination.value.page = Number(route.query.page ?? 1)
  await getApiKeys()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <card-breadcrumbs />

    <base-card>
      <template #header>API Keys</template>
      <p>
        API key is a unique code that serves to provide login access and link code from one
        developer to another. As already explained, it is beneficial in the authentication process,
        notably when an API will be run by developers.
      </p>
      <div class="my-5 flex gap-2">
        <router-link to="/credentials/api-keys/create">
          <base-button color="primary" shape="sharp">Create</base-button>
        </router-link>
        <base-input v-model="searchAll" placeholder="Search..." border="full" class="w-full" />
      </div>
      <div class="flex flex-col gap-4">
        <base-table>
          <thead>
            <tr>
              <th class="w-1"></th>
              <th>{{ columns[1] }}</th>
              <th>{{ columns[2] }}</th>
              <th>{{ columns[3] }}</th>
            </tr>
            <tr class="bg-slate-50 dark:bg-slate-700">
              <th></th>
              <th class="basic-table-head">
                <base-input
                  required
                  v-model="search[0]"
                  placeholder="Search"
                  border="none"
                  class="font-normal text-slate-800 dark:text-slate-400"
                />
              </th>
              <th class="basic-table-head">
                <base-autocomplete
                  class="font-normal"
                  v-model="selected"
                  :options="options"
                  placeholder="Search"
                  border="none"
                ></base-autocomplete>
              </th>
              <th class="basic-table-head">
                <base-input
                  required
                  v-model="search[0]"
                  placeholder="Search"
                  border="none"
                  class="font-light text-slate-800 dark:text-slate-400"
                ></base-input>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(apiKey, index) in apiKeys" :key="index">
              <td>
                <base-popover placement="bottom">
                  <base-button size="xs">
                    <base-icon class="text-xl" icon="i-ph-dots-three-bold"></base-icon>
                  </base-button>
                  <template #content>
                    <base-card class="py-1! px-2! text-sm">
                      <div class="flex flex-col">
                        <base-link href="#" variant="text" color="info">
                          <div class="flex gap-2 w-full">
                            <base-icon class="text-xl" icon="i-ph-eye"></base-icon>
                            <p>Show</p>
                          </div>
                        </base-link>
                        <base-link href="#" variant="text" color="info">
                          <div class="flex gap-2 w-full">
                            <base-icon class="text-xl" icon="i-ph-pencil"></base-icon>
                            <p>Update</p>
                          </div>
                        </base-link>
                        <base-divider orientation="vertical" class="my-1!"></base-divider>
                        <base-button variant="text" color="danger">
                          <div class="flex gap-2 w-full">
                            <base-icon class="text-xl" icon="i-ph-trash"></base-icon>
                            <p>Delete</p>
                          </div>
                        </base-button>
                      </div>
                    </base-card>
                  </template>
                </base-popover>
              </td>
              <td>
                <base-link size="none" href="#" class="text-blue">
                  {{ apiKey.name }}
                </base-link>
              </td>
              <td>{{ apiKey.created_date }}</td>
              <td>{{ apiKey.prefix_api_key }}...</td>
            </tr>
          </tbody>
        </base-table>
        <base-pagination
          v-model="pagination.page"
          :page-size="pagination.page_size"
          :total-document="pagination.total_document"
          @update:model-value="updateData()"
        />
      </div>
    </base-card>
  </div>
</template>

<style scoped lang="postcss"></style>
