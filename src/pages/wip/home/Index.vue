<script setup lang="ts">
import Toolbar from './components/Toolbar.vue';

</script>
<template>
  <div class="container space-y-6">
    <div>
      <h1 class="text-lg font-semibold md:text-2xl">Work in progress</h1>
      <p class="text-muted-foreground">
        This section lets you assign workers to tasks, start, pause, and
        complete them, and view real-time task status.
      </p>
    </div>

    <section>
        <Toolbar />
    </section>
  </div>
</template>



<style scoped></style>
