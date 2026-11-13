<template>
  <div class="flex min-h-screen flex-col">
    <Navbar />
    <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <router-view />
    </main>
    <footer class="border-t border-slate-200 bg-white">
      <div
        class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8"
      >
        <p>&copy; {{ year }} Passerelles Numériques Cambodia. All rights reserved.</p>
        <p>Academic Document Request Portal</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";

const year = new Date().getFullYear();
</script>
