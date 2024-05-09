<script setup lang="ts">
const name = defineModel('name')
</script>

<template>
  <base-card>
    <template #header>API Keys</template>
    <p>
      API key is a unique code that serves to provide login access and link code from one developer
      to another. As already explained, it is beneficial in the authentication process, notably when
      an API will be run by developers.
    </p>

    <div class="flex flex-col gap-4 mt-5">
      <base-input v-model="name" label="Name" />
    </div>
  </base-card>
</template>

<style scoped lang="postcss"></style>
