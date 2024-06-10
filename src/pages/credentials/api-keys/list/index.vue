<script setup lang="ts">
import { isDate } from '@point-hub/js-utils'
import { watchDebounced } from '@vueuse/core'
import { formatDate } from 'date-fns'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import axios from '@/axios'

import DeleteModal from '../components/delete-modal.vue'
import CardBreadcrumbs from './card-breadcrumbs.vue'

const route = useRoute()
const router = useRouter()
const deleteModalRef = ref()

interface IApiKey {
  _id: string
  name: string
  created_date: string
  prefix_api_key: string
  apiKey: string
}
const searchAll = ref('')
const search = ref({
  name: '',
  createdDate: '',
  apiKey: ''
})
const isLoading = ref(false)

watchDebounced(
  searchAll,
  async () => {
    isLoading.value = true
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
    isLoading.value = false
  },
  { debounce: 500, maxWait: 1000 }
)

watchDebounced(
  search.value,
  async () => {
    isLoading.value = true
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
    isLoading.value = false
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
  const date = search.value.createdDate.split('-')
  const response = await axios.get('/v1/api-keys', {
    params: {
      filter: {
        search: searchAll.value,
        name: search.value.name,
        created_date: isDate(`${date[2]}-${date[1]}-${date[0]}`)
          ? new Date(`${date[2]}-${date[1]}-${date[0]} 00:00:00`)
          : '',
        prefix_api_key: search.value.apiKey
      },
      page: pagination.value.page
    }
  })
  apiKeys.value = response.data.data
  pagination.value = response.data.pagination
}
const rowMenuRef = ref()
const apiKeys = ref<IApiKey[]>()
const pagination = ref({
  page: 1,
  page_size: 10,
  total_document: 0
})
onMounted(async () => {
  searchAll.value = route.query.search?.toString() ?? ''
  pagination.value.page = Number(route.query.page ?? 1)
  await getApiKeys()
})
const openMenu = (apiKey: IApiKey, index: number) => {
  rowMenuRef.value[index].toggle(false)
  deleteModalRef.value.toggleModal(true, {
    id: apiKey._id,
    name: apiKey.name
  })
}
const onDelete = async () => {
  await getApiKeys()
}
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
              <th>Name</th>
              <th>Created Date</th>
              <th>Api Key</th>
            </tr>
            <tr class="bg-slate-50 dark:bg-slate-700">
              <th></th>
              <th class="basic-table-head">
                <base-input required v-model="search.name" placeholder="Search" border="none" />
              </th>
              <th class="basic-table-head">
                <base-datepicker v-model="search.createdDate" border="none" />
              </th>
              <th class="basic-table-head">
                <base-input required v-model="search.apiKey" placeholder="Search" border="none" />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="4">
                <p class="w-full h-32 flex items-center justify-center gap-2 text-center text-xl">
                  <base-spinner color="primary" size="xs" /> <span>Loading</span>
                </p>
              </td>
            </tr>
            <template v-if="!isLoading">
              <tr v-for="(apiKey, index) in apiKeys" :key="index">
                <td>
                  <base-popover placement="bottom" ref="rowMenuRef">
                    <base-button size="xs" @click="rowMenuRef[index].toggle()">
                      <base-icon class="text-xl" icon="i-ph-dots-three-bold"></base-icon>
                    </base-button>
                    <template #content>
                      <base-card class="py-1! px-2! text-sm">
                        <div class="flex flex-col">
                          <router-link :to="`/credentials/api-keys/${apiKey._id}`">
                            <base-button variant="text" color="info">
                              <div class="flex gap-2 w-full">
                                <base-icon class="text-xl" icon="i-ph-pencil"></base-icon>
                                <p>Manage</p>
                              </div>
                            </base-button>
                          </router-link>
                          <base-divider orientation="vertical" class="my-1!"></base-divider>
                          <base-button
                            variant="text"
                            color="danger"
                            @click="openMenu(apiKey, index)"
                          >
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
                  <router-link :to="`/credentials/api-keys/${apiKey._id}`" class="text-blue">
                    {{ apiKey.name }}
                  </router-link>
                </td>
                <td>{{ formatDate(new Date(apiKey.created_date), 'dd-MM-yyyy') }}</td>
                <td>{{ apiKey.prefix_api_key }}...</td>
              </tr>
            </template>
          </tbody>
        </base-table>
        <base-pagination
          v-if="!isLoading"
          v-model="pagination.page"
          :page-size="pagination.page_size"
          :total-document="pagination.total_document"
          @update:model-value="updateData()"
        />
      </div>
    </base-card>

    <delete-modal ref="deleteModalRef" @deleted="onDelete" />
  </div>
</template>

<style scoped lang="postcss"></style>
