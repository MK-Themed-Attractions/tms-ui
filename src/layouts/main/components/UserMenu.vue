<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { msTeamLink } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { CircleUser, LifeBuoy, LogOut, User } from "lucide-vue-next";

const authStore = useAuthStore();
async function handleLogout() {
  await authStore.logout();
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="secondary" size="icon" class="rounded-full">
        <CircleUser class="h-5 w-5" />
        <span class="sr-only">Toggle user menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-[10rem]">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem as-child>
        <RouterLink :to="{ name: 'profile' }">
          <User />
          Profile
        </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuItem as-child>
        <a :href="msTeamLink()" target="_blank">
          <LifeBuoy />
          Support
        </a>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="cursor-pointer" @click="handleLogout">
        <LogOut />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped></style>
