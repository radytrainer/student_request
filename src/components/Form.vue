<template>
  <div class="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
    <h2 class="text-2xl font-bold mb-4">Request Form</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">

      <!-- Full Name -->
      <input v-model="form.fullName" type="text" placeholder="Full Name"
             class="w-full p-2 border rounded-lg" required />

      <!-- Batch -->
      <input v-model="form.batch" type="text" placeholder="Batch (e.g., Batch 2016)"
             class="w-full p-2 border rounded-lg" required />

      <!-- Contact -->
      <input v-model="form.contact" type="text" placeholder="Phone or Email"
             class="w-full p-2 border rounded-lg" required />

      <!-- Request Type -->
      <select v-model="form.requestType" class="w-full p-2 border rounded-lg" required>
        <option disabled value="">Select Request Type</option>
        <option value="Transcript">Transcript</option>
        <option value="Certificate">Certificate</option>
        <option value="Both">Both</option>
      </select>

      <!-- Transcript Quantity -->
      <div v-if="form.requestType === 'Transcript' || form.requestType === 'Both'">
        <input v-model="form.transcriptCount" type="number" min="1"
               placeholder="Enter number of Transcripts"
               class="w-full p-2 border rounded-lg" />
      </div>

      <!-- Certificate Quantity -->
      <div v-if="form.requestType === 'Certificate' || form.requestType === 'Both'">
        <input v-model="form.certificateCount" type="number" min="1"
               placeholder="Enter number of Certificates"
               class="w-full p-2 border rounded-lg" />
      </div>

      <!-- Submit Button -->
      <button type="submit"
              class="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
        Submit Request
      </button>
    </form>

    <p v-if="success" class="text-green-600 mt-2">✅ Submitted successfully!</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  fullName: "",
  batch: "",
  contact: "",
  requestType: "",
  transcriptCount: "",
  certificateCount: "",
});

const success = ref(false);

// Replace with your Google Apps Script Web App URL

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwKHb5Gt6R-o_LLfWKANLa53MN4S2z5XHKQwCGRFm1Tp-DhWQmzTs4U0oSEcJ73H-j7hg/exec"

const handleSubmit = async () => {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(form.value),
    });
    success.value = true;
    form.value = {
      fullName: "",
      batch: "",
      contact: "",
      requestType: "",
      transcriptCount: "",
      certificateCount: "",
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
</script>
