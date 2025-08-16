<template>
  <div class="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
    <h2 class="text-2xl font-bold mb-4">Submitted Data</h2>
    <ul class="space-y-3">
      <li v-for="(item, index) in data" :key="index" class="border p-3 rounded-lg">
        <p><strong>Name:</strong> {{ item.name }}</p>
        <p><strong>Email:</strong> {{ item.email }}</p>
        <p><strong>Message:</strong> {{ item.message }}</p>
        <p class="text-gray-500 text-sm">{{ item.date }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const data = ref([]);
const GOOGLE_SCRIPT_URL = "YOUR_DEPLOYED_WEB_APP_URL"; // same URL but GET request

onMounted(async () => {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    data.value = await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>
