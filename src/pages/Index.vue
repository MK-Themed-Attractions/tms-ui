<script setup lang="ts">
import { ImageApp } from "@/components/app/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { msTeamLink } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { Hand, PartyPopper } from "lucide-vue-next";
import { storeToRefs } from "pinia";

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
</script>
<template>
  <div class="flex items-center">
    <h1 class="text-lg font-semibold md:text-2xl">MKTA Task management system</h1>
  </div>
  <div class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
    <div class="flex flex-col items-center gap-1 text-center" v-if="!user">
      <ImageApp image="/MKLogo-White.svg" class="invert size-[8rem]" />
      <h3 class="text-2xl font-bold tracking-tight">Login Required</h3>
      <p class="text-sm text-muted-foreground max-w-[27ch]">
        Start using TMS by logging in. Don&apos;t have an account? Contact the <a class="font-medium"
          :href="msTeamLink()">Dev team</a>.
      </p>
      <Separator label="OR" class="mt-2" />
      <Button class="mt-4" as-child>
        <RouterLink :to="{ name: 'login' }">
          Login
        </RouterLink>
      </Button>
    </div>
    <div v-else>
      <div class="font-bold flex gap-2 items-center justify-center">
        <span> Welcome ,{{ user.given_name }} </span>
        <PartyPopper />
      </div>
      <p class="text-sm">Dashboard feature will be added soon...</p>
    </div>
  </div>

</template>

<style scoped></style>
