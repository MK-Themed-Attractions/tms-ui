<script setup lang="ts"></script>

<template>
  <div class="space-y-6">
    <RouterView>
      <template #default="{ Component }">
        <KeepAlive>
          <component :is="Component"></component>
        </KeepAlive>
      </template>
    </RouterView>
  </div>
</template>

<style scoped></style>
