<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Requests</h2>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold">Full Name</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Batch</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Transcript</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Certificate</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in requests" :key="index" class="border-b hover:bg-gray-100 even:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-800">{{ row.fullName }}</td>
            <td class="px-4 py-3 text-sm text-gray-800">{{ row.batch }}</td>
            <td class="px-4 py-3 text-sm text-gray-800 text-center">{{ row.transcriptCount }}</td>
            <td class="px-4 py-3 text-sm text-gray-800 text-center">{{ row.certificateCount }}</td>
            <td class="px-4 py-3 text-sm text-gray-800">
              <span
                class="px-3 py-1 text-xs font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': row.status === 'Completed',
                  'bg-yellow-100 text-yellow-800': row.status === 'New Request',
                  'bg-red-100 text-red-800': row.status === 'Pending'
                }"
              >
                {{ row.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="loading" class="text-gray-500 mt-2">Loading latest requests...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const requests = ref([]);
const loading = ref(false);
let intervalId = null;

// Replace with your Google Apps Script URL
const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_SCRIPT_URL";

// Fetch data from Google Sheets
const fetchRequests = async () => {
  loading.value = true;
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    requests.value = await res.json();
  } catch (err) {
    console.error("Failed to fetch requests:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRequests(); // Initial load
  intervalId = setInterval(fetchRequests, 5000); // Fetch every 5 seconds
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>
