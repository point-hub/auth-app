<script setup lang="ts">
import {
  type IAppMenu,
  useDarkMode,
  useMobileBreakpoint,
  useSidebar,
  useSidebarMenuStore,
  useSidebarStore
} from '@point-hub/papp'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth.store'
import { apiRequest } from '@/utils/api'

import { version } from '../../package.json'

const route = useRoute()
const router = useRouter()

useSidebar()

const authStore = useAuthStore()
const mobileBreakpoint = useMobileBreakpoint()
const sidebarStore = useSidebarStore()
const sidebarMenuStore = useSidebarMenuStore()
const { isDarkMode, toggleDarkMode } = useDarkMode()

// Sidebar
const appMenu = ref<IAppMenu[]>([
  {
    name: 'Auth',
    path: '/',
    icon: 'https://assets.pointhub.net/assets/images/logo/primary/icon-rounded.png'
  }
])
const appList = ref<IAppMenu[]>([
  {
    name: 'Auth',
    path: 'https://www.example.com'
  }
])

// Header
const account = ref({
  organization: 'Organization',
  username: 'John Doe',
  avatar: 'https://placehold.co/150'
})

const organizations = ref([
  {
    name: 'Organization ABC',
    link: '?organization=abc'
  }
])

const onSignout = async () => {
  await apiRequest.post('/v1/auth/signout')
  router.push('/signin')
}

onMounted(() => {
  sidebarMenuStore.onChooseApp(route.path)
})

watch(
  () => authStore.permissions,
  () => {
    appMenu.value[0].menu = [{ name: 'Home', path: '/' }]
    appMenu.value[0].menu.push({ name: 'My Account', path: '/my-account' })

    sidebarMenuStore.setAppMenu(appMenu.value, appList.value)
  },
  {
    immediate: true
  }
)
</script>

<template>
  <app-preloader />

  <div class="app-layout">
    <!-- Header -->
    <app-header>
      <template #left-header>
        <header-sidebar-button
          :on-toggle-sidebar="sidebarStore.toggleSidebar"
          v-model:is-sidebar-open="sidebarStore.isSidebarOpen"
        />
      </template>
      <template #right-header>
        <header-notification></header-notification>
        <base-divider class="h-10" orientation="horizontal" />
        <header-menu
          :organization="account.organization"
          :username="account.username"
          :avatar="account.avatar"
        >
          <header-menu-account
            :organization="account.organization"
            :username="account.username"
            :avatar="account.avatar"
          />
          <base-divider orientation="vertical" />
          <header-menu-switch-organization :organizations="organizations" />
          <header-menu-dark-mode
            :on-toggle-dark-mode="toggleDarkMode"
            v-model:is-dark-mode="isDarkMode"
          />
          <header-menu-signout :on-signout="onSignout" />
        </header-menu>
      </template>
    </app-header>

    <!-- Sidebar -->
    <app-sidebar
      :title="sidebarMenuStore.choosenAppTitle"
      :apps="sidebarMenuStore.appMenu"
      :menus="sidebarMenuStore.appMenu[sidebarMenuStore.choosenAppIndex].menu ?? []"
      :is-sidebar-open="sidebarStore.isSidebarOpen"
      :is-mobile="mobileBreakpoint.isMobile()"
      @choose="sidebarMenuStore.onChooseApp"
    />

    <!-- Main Container -->
    <div class="main-container">
      <!-- Main Content -->
      <main class="main-content">
        <router-view></router-view>
      </main>

      <!-- Footer -->
      <app-footer :version="version" :year="2025" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.app-layout {
  @apply h-100vh w-full flex grow;
}

.main-container {
  @apply flex flex-col py-4 space-y-8 w-full transition-all duration-300;
}

.is-sidebar-open .main-container {
  @apply lg:w-[calc(100%-(var(--sidebar-panel-width)+var(--sidebar-menu-width)))] lg:ml-[calc(var(--sidebar-panel-width)+var(--sidebar-menu-width))];
}

.main-content {
  @apply mt-[60px] px-4 flex-1;
}

.main-content-header {
  @apply flex space-x-4 py-2 overflow-x-hidden;
}

.main-content-body {
  @apply flex flex-col space-y-5;
}
</style>
