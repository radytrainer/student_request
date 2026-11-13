<template>
  <div class="mx-auto max-w-5xl">
    <div class="mb-8">
      <p class="text-sm font-semibold uppercase tracking-wide text-brand-600">Step 2 of 2</p>
      <h1 class="page-title mt-1">Submit your payment</h1>
      <p class="page-subtitle">
        Pay with the QR code below, then upload a screenshot of your payment confirmation.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <!-- Pay -->
      <section class="card p-6 sm:p-8 lg:col-span-2">
        <div class="flex items-center gap-3">
          <span class="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">1</span>
          <h2 class="text-base font-semibold text-slate-900">Scan and pay</h2>
        </div>

        <div class="mt-6 flex justify-center rounded-lg border border-slate-200 bg-white p-4">
          <img src="/qr.png" alt="Payment QR code for Passerelles Numériques, account 000 770 215" class="w-full max-w-[220px]" />
        </div>

        <table class="mt-6 w-full overflow-hidden rounded-lg text-sm ring-1 ring-slate-200">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" class="px-4 py-2.5 text-left font-semibold">Per paper</th>
              <th scope="col" class="px-4 py-2.5 text-right font-semibold">Copy</th>
              <th scope="col" class="px-4 py-2.5 text-right font-semibold">New</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="doc in ['Transcript', 'Certificate']" :key="doc">
              <th scope="row" class="px-4 py-3 text-left font-normal text-slate-600">{{ doc }}</th>
              <td class="px-4 py-3 text-right font-medium tabular-nums text-slate-900">{{ formatUSD(PRICES.Copy[doc]) }}</td>
              <td class="px-4 py-3 text-right font-medium tabular-nums text-slate-900">{{ formatUSD(PRICES.New[doc]) }}</td>
            </tr>
          </tbody>
        </table>

        <dl class="mt-4 rounded-lg border border-slate-200 text-sm">
          <div class="flex items-center justify-between bg-slate-50 px-4 py-3">
            <dt class="text-slate-600">Account</dt>
            <dd class="font-mono font-medium text-slate-900">000 770 215</dd>
          </div>
        </dl>
      </section>

      <!-- Upload -->
      <section class="card flex flex-col p-6 sm:p-8 lg:col-span-3">
        <div class="flex items-center gap-3">
          <span class="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">2</span>
          <h2 class="text-base font-semibold text-slate-900">Upload payment screenshot</h2>
        </div>

        <div
          v-if="status"
          class="mt-6 rounded-lg border p-4 text-sm"
          :class="status.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'"
          :role="status.ok ? 'status' : 'alert'"
        >
          {{ status.message }}
        </div>

        <div class="mt-6">
          <label for="trackingCode" class="label">Tracking code</label>
          <input
            id="trackingCode"
            v-model="trackingCode"
            type="text"
            class="input font-mono uppercase tracking-[0.2em] placeholder:font-sans placeholder:normal-case placeholder:tracking-normal"
            placeholder="e.g. K7M2QX"
            maxlength="8"
            autocomplete="off"
            spellcheck="false"
          />
          <p class="hint">From your request confirmation. Helps us match your payment to your request.</p>
        </div>

        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onSelect" />

        <!-- Drop zone -->
        <div
          v-if="!preview"
          class="mt-6 flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center transition"
          :class="dragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'"
          role="button"
          tabindex="0"
          @click="fileInput.click()"
          @keydown.enter.prevent="fileInput.click()"
          @keydown.space.prevent="fileInput.click()"
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="onDrop"
        >
          <svg class="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <p class="mt-4 text-sm font-medium text-slate-900">
            <span class="text-brand-600">Click to upload</span> or drag and drop
          </p>
          <p class="mt-1 text-xs text-slate-500">PNG or JPG screenshot of your payment</p>
        </div>

        <!-- Preview -->
        <div v-else class="mt-6 flex flex-1 flex-col">
          <div class="flex flex-1 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-4">
            <img :src="preview" alt="Selected payment screenshot" class="max-h-80 rounded object-contain" />
          </div>
          <div class="mt-3 flex items-center justify-between gap-3 text-sm">
            <p class="truncate text-slate-600">{{ image?.name }}</p>
            <button type="button" class="shrink-0 font-medium text-brand-600 hover:text-brand-700" :disabled="loading" @click="fileInput.click()">
              Change
            </button>
          </div>
        </div>

        <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button v-if="preview" type="button" class="btn-secondary" :disabled="loading" @click="reset">Remove</button>
          <button type="button" class="btn-primary" :disabled="!image || loading" @click="submitImage">
            <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
            </svg>
            {{ loading ? "Sending…" : "Submit payment" }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { PRICES, formatUSD } from "@/pricing";
import { myCodes, normalizeCode } from "@/requests";

const BOT_TOKEN = "8515689151:AAFsjsS91XposLwPPfuHLIRPVlwN0L0kMIE";
const CHAT_ID = "-5234855220";

const route = useRoute();
const trackingCode = ref(normalizeCode(route.query.code) || myCodes()[0] || "");
const fileInput = ref(null);
const image = ref(null);
const preview = ref(null);
const loading = ref(false);
const dragging = ref(false);
const status = ref(null);

const setFile = (file) => {
  if (!file || !file.type.startsWith("image/")) {
    status.value = { ok: false, message: "Please choose an image file." };
    return;
  }
  if (preview.value) URL.revokeObjectURL(preview.value);
  image.value = file;
  preview.value = URL.createObjectURL(file);
  status.value = null;
};

const onSelect = (e) => {
  setFile(e.target.files[0]);
  e.target.value = "";
};

const onDrop = (e) => {
  dragging.value = false;
  setFile(e.dataTransfer.files[0]);
};

const reset = () => {
  if (preview.value) URL.revokeObjectURL(preview.value);
  image.value = null;
  preview.value = null;
};

const submitImage = async () => {
  if (!image.value) return;
  loading.value = true;
  status.value = null;

  const paymentDateTime = new Date().toLocaleString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formData = new FormData();
  formData.append("chat_id", CHAT_ID);
  formData.append("photo", image.value);
  const code = normalizeCode(trackingCode.value);
  formData.append(
    "caption",
    [`💰 Payment Date & Time: ${paymentDateTime}`, code && `🔖 Tracking code: ${code}`].filter(Boolean).join("\n"),
  );

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: "POST",
      body: formData,
    });
    status.value = { ok: true, message: "Payment screenshot uploaded successfully. Thank you!" };
    reset();
  } catch (err) {
    console.error(err);
    status.value = { ok: false, message: "Upload failed. Please check your connection and try again." };
  } finally {
    loading.value = false;
  }
};
</script>
