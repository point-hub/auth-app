<script setup lang="ts">
import { computed, ref } from 'vue'

// Table Header
const options = [
  { id: 1, label: 'Quality Control Specialist' },
  { id: 2, label: 'Desktop Support Technician' },
  { id: 3, label: 'Tax Accountant' }
]

const selected = ref()
const searchAll = ref('')
const search = ref<string[]>([])

// Table Data
interface UserInterface {
  id: number
  name: string
  created_date: string
  key: string
  checked?: boolean
}

const users = ref<UserInterface[]>([
  {
    id: 1,
    name: 'Cy Ganderton',
    created_date: '21 Jan 2024',
    key: 'Blue'
  },
  {
    id: 2,
    name: 'Hart Hagerty',
    created_date: '24 Feb 2024',
    key: 'Purple'
  },
  { id: 3, name: 'Brice Swyre', created_date: '19 Aug 2012', key: 'A391feh.....' }
])

// Section Pagination
const page = ref(1)
const pageSize = ref(3)
const totalDocument = ref(100)

const updateData = () => {}

// Table Setting
const showModal = ref(false)
const openTableSetting = () => {
  showModal.value = true
}

const columns = ref([
  {
    name: 'Checkbox',
    isShow: true,
    isEditable: true
  },
  {
    name: 'Name',
    isShow: true,
    isEditable: false
  },
  {
    name: 'Created Date',
    isShow: true,
    isEditable: true
  },
  {
    name: 'Key',
    isShow: true,
    isEditable: true
  }
])

const optionsPageSize = [
  { value: 10, label: '10' },
  { value: 25, label: '25' },
  { value: 50, label: '50' },
  { value: 100, label: '100' }
]

// Selecting Table Row
const selectAll = computed({
  get() {
    return isCheckedAll()
  },
  set() {
    if (isCheckedAll()) {
      users.value.forEach((user) => {
        user.checked = false
      })
    } else {
      users.value.forEach((user) => {
        user.checked = true
      })
    }
  }
})

const isCheckedAll = () => {
  for (const user of users.value) {
    if (user.checked === undefined || user.checked === false) {
      return false
    }
  }

  return true
}

const breadcrumbs = [
  {
    name: 'Menu',
    path: '/menu'
  },
  {
    name: 'Credentials',
    path: '/credentials'
  },
  {
    name: 'API Keys'
  }
]
</script>

<template>
  <div class="flex flex-col gap-4">
    <base-card class="py-3!">
      <base-breadcrumb :items="breadcrumbs" separator="angle" v-slot="{ item }">
        <router-link v-if="item.path" :to="item.path">
          {{ item.name }}
        </router-link>
        <span v-else>{{ item.name }}</span>
      </base-breadcrumb>
    </base-card>

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
              <th v-if="columns[3].isShow" class="w-1"></th>
              <th v-if="columns[1].isShow">{{ columns[1].name }}</th>
              <th v-if="columns[2].isShow">{{ columns[2].name }}</th>
              <th v-if="columns[3].isShow">{{ columns[3].name }}</th>
            </tr>
            <tr class="bg-slate-50 dark:bg-slate-700">
              <th></th>
              <th v-if="columns[1].isShow" class="basic-table-head">
                <base-input
                  required
                  v-model="search[0]"
                  placeholder="Search"
                  border="none"
                  class="font-normal text-slate-800 dark:text-slate-400"
                ></base-input>
              </th>
              <th v-if="columns[2].isShow" class="basic-table-head">
                <base-autocomplete
                  class="font-normal"
                  v-model="selected"
                  :options="options"
                  placeholder="Search"
                  border="none"
                ></base-autocomplete>
              </th>
              <th v-if="columns[3].isShow" class="basic-table-head">
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
            <tr v-for="(user, index) in users" :key="index">
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
              <td v-if="columns[1].isShow">
                <base-link size="none" href="#" class="text-blue">
                  {{ user.name }}
                </base-link>
              </td>
              <td v-if="columns[2].isShow">{{ user.created_date }}</td>
              <td v-if="columns[3].isShow">{{ user.key }}</td>
            </tr>
          </tbody>
        </base-table>
        <base-pagination
          v-model="page"
          :page-size="pageSize"
          :totalDocument="totalDocument"
          @update:model-value="updateData()"
        />
      </div>
    </base-card>
  </div>
</template>

<style scoped lang="postcss"></style>
