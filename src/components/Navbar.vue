<template>
  <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
    <nav class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <router-link to="/form" class="flex items-center gap-3" @click="open = false">
        <img src="@/assets/logo.png" alt="Passerelles Numériques" class="h-9 w-auto" />
        <span class="hidden border-l border-slate-200 pl-3 text-sm font-medium text-slate-500 lg:block">
          Student Request Portal
        </span>
      </router-link>

      <!-- Desktop links -->
      <div class="hidden items-center gap-1 md:flex">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          active-class="!bg-brand-50 !text-brand-700"
        >
          {{ link.label }}
        </router-link>

        <span class="mx-2 h-6 w-px bg-slate-200" aria-hidden="true"></span>

        <!-- Staff -->
        <template v-if="currentUser">
          <router-link
            to="/admin"
            class="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            Dashboard
          </router-link>
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            @click="signOutUser"
          >
            Sign out
          </button>
        </template>
        <router-link
          v-else
          to="/admin"
          class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          active-class="!bg-brand-50 !text-brand-700"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          Staff
        </router-link>
      </div>

      <!-- Mobile toggle -->
      <button
        type="button"
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
        :aria-expanded="open"
        aria-label="Toggle navigation"
        @click="open = !open"
      >
        <svg v-if="!open" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
        <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <!-- Mobile menu -->
    <div v-if="open" class="space-y-1 border-t border-slate-200 bg-white px-4 py-3 md:hidden">
      <router-link
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        active-class="!bg-brand-50 !text-brand-700"
        @click="open = false"
      >
        {{ link.label }}
      </router-link>
      <div class="my-2 border-t border-slate-200"></div>
      <template v-if="currentUser">
        <router-link
          to="/admin"
          class="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          active-class="!bg-brand-50 !text-brand-700"
          @click="open = false"
        >
          Staff dashboard
        </router-link>
        <button
          type="button"
          class="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-100"
          @click="signOutUser(); open = false"
        >
          Sign out
        </button>
      </template>
      <router-link
        v-else
        to="/admin"
        class="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
        @click="open = false"
      >
        Staff sign in
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { currentUser, signOutUser } from "@/auth";

const open = ref(false);

const links = [
  { to: "/form", label: "New Request" },
  { to: "/payment_screenshot", label: "Payment" },
  { to: "/track", label: "Track Request" },
];
</script>
