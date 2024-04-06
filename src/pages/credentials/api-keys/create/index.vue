<script setup lang="ts">
import { ref } from 'vue'

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
    name: 'API Keys',
    path: '/credentials/api-keys'
  },
  {
    name: 'Create'
  }
]

const columns = ref([
  {
    name: 'Checkbox'
  },
  {
    name: 'Name'
  },
  {
    name: 'Created Date'
  },
  {
    name: 'Key'
  }
])

const form = ref({
  key: 'JE991-JF004-ALW3910-XCF931',
  name: ''
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
      <template #header>API Keys</template>
      <p>
        API key is a unique code that serves to provide login access and link code from one
        developer to another. As already explained, it is beneficial in the authentication process,
        notably when an API will be run by developers.
      </p>

      <form class="flex flex-col gap-4 mt-5" @submit.prevent="">
        <base-input v-model="form.key" disabled label="Key">
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
        <base-input v-model="form.name" label="Name" />
        <div>
          <base-button color="primary">Save</base-button>
        </div>
      </form>
    </base-card>

    <base-card>
      <template #header>Website restrictions</template>
      <p>
        Restrict key usage requests to the specified websites. Here are some examples of URLs that
        you can allow to set up a website:
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
              <tr v-for="i in 5">
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
        <div>
          <div class="prose text-sm">
            <ul>
              <li>
                Any URL in a single domain with no subdomains:
                <ul class="my-0">
                  <li>https://example.com</li>
                </ul>
              </li>
              <li>
                Any URL in a single subdomain:
                <ul class="my-0">
                  <li>https://sub.example.com</li>
                </ul>
              </li>
              <li>
                Any subdomain in a single domain, using a wildcard asterisk (*):
                <ul class="my-0">
                  <li>https://*.example.com</li>
                </ul>
              </li>
              <li>
                A domain and all its subdomains, using a wildcard asterisk (*):
                <ul class="my-0">
                  <li>https://example.com</li>
                  <li>https://*.example.com</li>
                </ul>
              </li>
              <li>
                A URL with a non-standard port:
                <ul class="my-0">
                  <li>http://www.example.com:8000</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <form class="flex flex-col gap-4 mt-5" @submit.prevent="">
        <base-input v-model="form.name" label="Website URL" />
        <div>
          <base-button color="primary">Save</base-button>
        </div>
      </form>
    </base-card>

    <base-card>
      <template #header>IP address restrictions</template>
      <p>
        Specify one or more IP addresses of the callers that are allowed to use your API key. Format
        as an IPv4 or IPv6 address or a subnet using CIDR notation. Examples: 192.168.0.1,
        172.16.0.0/12, 2001:db8::1 or 2001:db8::/64
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
          <tr v-for="i in 5">
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
        <base-input v-model="form.name" label="IP Address" />
        <div>
          <base-button color="primary">Save</base-button>
        </div>
      </form>
    </base-card>
  </div>
</template>

<style scoped lang="postcss"></style>
