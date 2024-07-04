<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import axios from '@/axios'
import { useToastStore } from '@/stores/toast-store'

import CardAuthorizedUrls from '../components/card-authorized-urls.vue'
import CardRedirectUrls from '../components/card-redirect-urls.vue'
import DeleteModal from '../components/delete-modal.vue'
import type { IAuthorizedUrl, IRedirectUrl } from '../types'
import CardApplication from './card-application.vue'
import CardBreadcrumbs from './card-breadcrumbs.vue'
import { useForm } from './form'

const route = useRoute()
const router = useRouter()
const { toastRef } = useToastStore()
const deleteModalRef = ref()

const form = reactive(useForm())

const formId = ref()
const oauth2Response = ref()
const clientId = ref()
const prefixClientSecret = ref()
const authorizedUrls = ref<IAuthorizedUrl[]>([])
const redirectUrls = ref<IRedirectUrl[]>([])

onMounted(async () => {
  oauth2Response.value = (await axios.get(`/v1/oauth2s/${route.params.id}`)).data
  formId.value = oauth2Response.value._id
  form.data.name = oauth2Response.value.name
  form.data.authorized_urls = oauth2Response.value.authorized_urls
  form.data.redirect_urls = oauth2Response.value.redirect_urls
  clientId.value = oauth2Response.value.client_id
  prefixClientSecret.value = oauth2Response.value.prefix_client_secret

  for (const iterator of oauth2Response.value.authorized_urls ?? []) {
    authorizedUrls.value.push({
      id: uuidv4(),
      url: iterator
    })
  }

  for (const iterator of oauth2Response.value.redirect_urls ?? []) {
    redirectUrls.value.push({
      id: uuidv4(),
      url: iterator
    })
  }
})

const generatedClientSecret = ref()
const onUpdate = async () => {
  // convert web restrictions array
  form.data.authorized_urls = authorizedUrls.value.map(function (item) {
    return item['url']
  })

  // convert ip url restrictions array
  form.data.redirect_urls = redirectUrls.value.map(function (item) {
    return item['url']
  })

  const response = await axios.patch(`/v1/oauth2s/${route.params.id}`, form.data)
  if (response.status === 200) {
    toastRef.toast('Update success')
    router.push('/credentials/oauth2s')
  }
}

const showGeneratedInfo = ref(false)
const toggleApiKeyModal = (value: boolean) => {
  let newValue = !showGeneratedInfo.value
  if (value === true) newValue = true
  if (value === false) newValue = false
  showGeneratedInfo.value = newValue
}

const onCloseRegeneratedModal = () => {
  toggleApiKeyModal(false)
}

const tooltip = ref('copy')
const onCopyApiKey = () => {
  navigator.clipboard.writeText(generatedClientSecret.value)
  tooltip.value = 'copied!'
}

// regenerate modal logic
const onDeleted = async () => {
  router.push('/credentials/oauth2s')
}

const onRegenerated = (prefixClientSecret: string) => {
  generatedClientSecret.value = prefixClientSecret
  toggleApiKeyModal(true)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <card-breadcrumbs :id="route.params.id.toString()" />

    <card-application
      v-model:name="form.data.name"
      v-model:clientId="clientId"
      v-model:prefixClientSecret="prefixClientSecret"
      :form-id="route.params.id.toString()"
      :errors="form.errors"
    />

    <card-authorized-urls v-model:authorizedUrls="authorizedUrls" />

    <card-redirect-urls v-model:redirectUrls="redirectUrls" />

    <base-card>
      <div class="flex gap-2">
        <base-button color="primary" @click="onUpdate()">Update</base-button>
        <base-button
          color="danger"
          @click="
            deleteModalRef.toggleModal(true, {
              id: route.params.id.toString(),
              name: form.data.name
            })
          "
        >
          Delete
        </base-button>
      </div>
    </base-card>

    <!-- success confirmation, and inform user to save the api key -->
    <base-modal :is-open="showGeneratedInfo" @on-close="onCloseRegeneratedModal()">
      <div class="max-h-90vh overflow-auto p-4">
        <h2 class="py-4 text-2xl font-bold">OAuth2 credential updated</h2>
        <div class="space-y-8">
          <p>Make sure to copy your OAuth2 credential now. You won't be able to see it again!</p>
          <div class="flex flex-col gap-2">
            <span class="font-semibold">Your OAuth2 credential</span>
            <div class="w-full border border-black flex items-center gap-2 py-2">
              <base-button size="sm" v-tooltip="tooltip" @click="onCopyApiKey">
                <base-icon icon="i-far-copy"></base-icon>
              </base-button>
              <div>{{ generatedClientSecret }}</div>
            </div>
          </div>
          <div class="flex gap-2">
            <base-button color="primary" size="sm" @click="toggleApiKeyModal(false)">
              Close
            </base-button>
          </div>
        </div>
      </div>
    </base-modal>

    <delete-modal ref="deleteModalRef" @deleted="onDeleted" />
  </div>
</template>
