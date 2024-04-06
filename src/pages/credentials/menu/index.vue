<script setup lang="ts">
const breadcrumbs = [
  {
    name: 'Menu',
    path: '/menu'
  },
  {
    name: 'Credentials'
  }
]

const links = [
  {
    name: 'API Keys',
    description:
      'API key is a unique code that serves to provide login access and link code from one developer to another',
    path: '/credentials/api-keys'
  },
  {
    name: 'OAuth 2.0',
    description:
      'OAuth 2.0 is the industry-standard protocol for authorization. OAuth 2.0 focuses on client developer simplicity while providing specific authorization flows for applications',
    path: '/credentials/oauth2'
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

    <div class="grid cols-1 sm:cols-2 lg:cols-3 xl:cols-4 gap-4">
      <base-button size="none" v-for="link in links" :key="link">
        <router-link :to="link.path" class="w-full">
          <base-card class="p-3! h-32">
            <template #header>{{ link.name }}</template>
            <p class="line-clamp-3 text-sm">{{ link.description }}</p>
          </base-card>
        </router-link>
      </base-button>
    </div>
  </div>
</template>

<style scoped lang="postcss"></style>
