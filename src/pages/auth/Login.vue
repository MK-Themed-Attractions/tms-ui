<script setup lang="ts">
import { ref } from "vue";
import type { LoginCredential } from "@/types/auth";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { ButtonApp } from "@/components/app/button";
import LoginErrorAlert from "./LoginErrorAlert.vue";

const form = ref<LoginCredential>({
  email: "",
  password: "",
});

const authStore = useAuthStore();
const { errors, loading } = storeToRefs(authStore);

async function login() {
  await authStore.login(form.value);

  /* clear the password when theres an error */
  if (errors.value) {
    form.value.password = "";
  }
}
</script>

<template>
  <div class="min-h-screen w-full lg:grid lg:grid-cols-2">
    <!-- #region login  -->
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">Login</h1>
          <p class="text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <LoginErrorAlert v-if="errors">{{
          errors.data.message
        }}</LoginErrorAlert>

        <form class="grid gap-4" @submit.prevent="login">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              v-model="form.email"
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a
                href="/forgot-password"
                class="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input id="password" type="password" v-model="form.password" />
          </div>
          <ButtonApp type="submit" class="w-full" :loading="loading">
            Login
          </ButtonApp>
        </form>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <a href="#" class="underline"> Sign up </a>
        </div>
      </div>
    </div>
    <!-- #endregion login -->

    <!-- #region side-image -->
    <div class="hidden place-content-center gap-2 bg-muted lg:grid">
      <div class="mx-auto h-[10rem] w-[20rem] overflow-hidden invert">
        <img src="/MKLogo-White.svg" alt="Image" />
      </div>
      <h1 class="text-center text-xl font-medium">Task Management System</h1>
    </div>
    <!-- #endregion side-image -->
  </div>
</template>

<style scoped></style>
