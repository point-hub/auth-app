<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

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
    name: 'OAuth 2.0',
    path: '/credentials/oauth2'
  },
  {
    name: 'Create'
  }
]

const applicationTypes = [{ label: 'Website' }]
const applicationType = ref()

watch(applicationType, (newValue: any) => {
  form.value.application_type = newValue.label
})

onMounted(() => {
  applicationType.value = applicationTypes[0]
})

const form = ref({
  application_type: '',
  key: 'JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931JE991-JF004-ALW3910-XCF931'
})
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
      <template #header>OAuth 2.0 Client IDs</template>
      <p>
        A client ID is used to identify a single app to Pointhub's OAuth servers. If your app runs
        on multiple platforms, each will need its own client ID
      </p>

      <form class="flex flex-col gap-4 mt-5" @submit.prevent="">
        <base-select v-model="applicationType" :options="applicationTypes" />
        <base-input
          v-model="form.name"
          label="Name"
          :helpers="[
            'The name of your OAuth 2.0 client. This name is only used to identify the client in the console and will not be shown to end users.'
          ]"
        />
        <base-form label="Client ID">
          <div class="flex flex-col">
            <div>{{ form.key }}</div>
            <div>
              <base-button color="secondary" variant="outlined" v-tooltip="'Copy'" size="xs">
                <base-icon icon="i-fad-copy" /> Click to copy
              </base-button>
            </div>
          </div>
        </base-form>
        <base-textarea v-model="form.key" disabled label="Client ID">
          <template #prefix>
            <base-button
              color="info"
              variant="text"
              v-tooltip="'Copy'"
              size="none"
              shape="sharp"
              class="h-full mr-3"
            >
              <base-icon icon="i-fad-copy mx-3" />
            </base-button>
          </template>
        </base-textarea>
        <base-input v-model="form.key" disabled label="Client Secret">
          <template #prefix>
            <base-button
              color="info"
              variant="text"
              v-tooltip="'Copy'"
              size="none"
              shape="sharp"
              class="h-full mr-3"
            >
              <base-icon icon="i-fad-copy mx-3" />
            </base-button>
          </template>
        </base-input>

        <div>
          <base-button color="primary">Save</base-button>
        </div>
      </form>
    </base-card>

    <base-card>
      <template #header>Authorized JavaScript origins</template>
      <p>
        The HTTP origins that host your web application. This value can't contain wildcards or
        paths. If you use a port other than 80, you must specify it. For example:
        https://example.com:8080
      </p>
      <div class="flex gap-10 mt-5">
        <div class="flex-1">
          <base-table>
            <thead>
              <tr>
                <th>
                  <base-input border="none" class="font-light" placeholder="Search" />
                </th>
                <th class="w-1"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 5" :key="i">
                <td>https://www.pointhub.net</td>
                <td>
                  <div class="flex">
                    <base-button size="sm" v-tooltip="'edit'">
                      <base-icon icon="i-fad-pencil"></base-icon>
                    </base-button>
                    <base-button size="sm" v-tooltip="'delete'">
                      <base-icon icon="i-fad-trash"></base-icon>
                    </base-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </base-table>
        </div>
      </div>

      <form class="flex flex-col gap-4 mt-5" @submit.prevent="">
        <base-input
          v-model="form.name"
          placeholder="https://www.example.com"
          label="URL"
          :helpers="['For use with requests from a browser']"
        />
        <div>
          <base-button color="primary">Save</base-button>
        </div>
      </form>
    </base-card>

    <base-card>
      <template #header>Authorized redirect URIs</template>
      <p>
        Users will be redirected to this path after they have authenticated with Google. The path
        will be appended with the authorization code for access, and must have a protocol. It can’t
        contain URL fragments, relative paths, or wildcards, and can’t be a public IP address.
      </p>

      <base-table>
        <thead>
          <tr>
            <th>
              <base-input border="none" class="font-light" placeholder="Search" />
            </th>
            <th class="w-1"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 5" :key="i">
            <td>192.168.0.1</td>
            <td>
              <div class="flex">
                <base-button size="sm" v-tooltip="'edit'">
                  <base-icon icon="i-fad-pencil"></base-icon>
                </base-button>
                <base-button size="sm" v-tooltip="'delete'">
                  <base-icon icon="i-fad-trash"></base-icon>
                </base-button>
              </div>
            </td>
          </tr>
        </tbody>
      </base-table>

      <form class="flex flex-col gap-4 mt-5" @submit.prevent="">
        <base-input
          v-model="form.name"
          label="URL"
          placeholder="https://www.example.com"
          :helpers="['For use with requests from a web server']"
        />
        <div>
          <base-button color="primary">Save</base-button>
        </div>
      </form>
    </base-card>
  </div>
</template>

<style scoped lang="postcss"></style>
