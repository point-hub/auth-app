import { ref, watch } from 'vue'

import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

export function useAppMenu() {
  const menus = ref<IApps[]>([
    {
      name: 'Auth',
      path: '/',
      icon: 'https://assets.pointhub.net/assets/images/logo/primary/icon-rounded.png'
    }
  ])

  watch(
    () => authStore.permissions,
    () => {
      menus.value[0].menu = [{ name: 'Home', path: '/' }]
      menus.value[0].menu?.push(...seedMenu())
    },
    {
      immediate: true
    }
  )

  return { menus }
}

const seedMenu = () => {
  const menu = ref<IMenu[]>([])

  menu.value.push({ name: 'Profile', path: '/profile' })
  menu.value.push({ name: 'My Account', path: '/my-account' })

  return menu.value
}
