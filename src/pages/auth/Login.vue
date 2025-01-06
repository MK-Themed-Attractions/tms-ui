<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoginCredential } from "@/types/auth";
import { ref } from "vue";

const form = ref<LoginCredential>({
  email: "",
  password: "",
});
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
        <div class="grid gap-4">
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
          <Button type="submit" class="w-full"> Login </Button>
        </div>
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
