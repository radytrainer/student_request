<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4 text-gray-800">Requests</h2>

    <div class="overflow-x-auto">
      <table
        class="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
      >
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold">Full Name</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Batch</th>
            <th class="px-4 py-3 text-left text-sm font-semibold">
              Transcript
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold">
              Certificate
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in requests"
            :key="index"
            class="border-b hover:bg-gray-100 even:bg-gray-50"
          >
            <td class="px-4 py-3 text-sm text-gray-800">{{ row.fullName }}</td>
            <td class="px-4 py-3 text-sm text-gray-800">{{ row.batch }}</td>
            <td class="px-4 py-3 text-sm text-gray-800 text-center">
              {{ row.transcriptCount }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-800 text-center">
              {{ row.certificateCount }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-800">
              <span
                class="px-3 py-1 text-xs font-semibold rounded-full"
                :class="{
                  'bg-green-100 text-green-800': row.status === 'Completed',
                  'bg-yellow-100 text-yellow-800': row.status === 'New Request',
                  'bg-red-100 text-red-800': row.status === 'Panding',
                }"
              >
                {{ row.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const requests = ref([]);

const fetchRequests = async () => {
  const res = await fetch(
    "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhsy8sLw1QYz5RM_8QfKxwqdkKXrKcwHgeQqvzEUiyxBmyDts553LMw0M4dOozC3senfcwhVIVornS7JMTMbYXP_eYLIND12wkUTjExhrd6YJKeVbhMVd2CNe5WOPec8MD5QfwRwv5vsMULRw6p0-cS19h4PsrkzjIBAMkTu_gD8uQ-gExz0LhtMO9a15Gm9wAIOLMj59deQsjtIwqj4o9d3Sfji8la8KsJzuAMLJqXHwyIf1YeJB9Lqg_gocTUa5kjbY8ecNNkWeHRUEC9e0bjKyJKEXqbHdKTSIjc&lib=M-Od6mL37jTZ9uy2s2tpqw0vcXMd-zcUe"
  );
  requests.value = await res.json();
};

onMounted(() => {
  fetchRequests();
});
</script>
