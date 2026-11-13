<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-8">
      <p class="text-sm font-semibold uppercase tracking-wide text-brand-600">Step 1 of 2</p>
      <h1 class="page-title mt-1">Request academic documents</h1>
      <p class="page-subtitle">
        Fill in your details to request official transcripts or certificates.
      </p>
    </div>

    <!-- Success -->
    <div
      v-if="success"
      class="mb-6 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
      role="status"
    >
      <svg class="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
      </svg>
      <div class="min-w-0 flex-1 text-sm">
        <p class="font-semibold text-emerald-800">Your request has been submitted.</p>
        <div class="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-emerald-200 bg-white px-4 py-3">
          <div>
            <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Your tracking code</p>
            <p class="font-mono text-2xl font-semibold tracking-[0.2em] text-slate-900">{{ submittedCode }}</p>
          </div>
          <button type="button" class="btn-secondary ml-auto py-1.5" @click="copyCode">{{ copied ? "Copied" : "Copy" }}</button>
        </div>
        <p class="mt-3 text-emerald-700">
          Save this code to check your progress. Next, pay <span class="font-semibold">{{ formatUSD(submittedTotal) }}</span>
          and upload the receipt.
        </p>
        <div class="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-semibold">
          <router-link :to="`/payment_screenshot?code=${submittedCode}`" class="text-emerald-800 underline underline-offset-2 hover:text-emerald-900">
            Go to payment &rarr;
          </router-link>
          <router-link :to="`/track/${submittedCode}`" class="text-emerald-800 underline underline-offset-2 hover:text-emerald-900">
            Track progress &rarr;
          </router-link>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="error"
      class="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
      role="alert"
    >
      <svg class="mt-0.5 h-5 w-5 shrink-0 text-red-600" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
      </svg>
      <p>{{ error }}</p>
    </div>

    <form class="card divide-y divide-slate-200" @submit.prevent="handleSubmit">
      <!-- Personal information -->
      <section class="p-6 sm:p-8">
        <h2 class="text-base font-semibold text-slate-900">Personal information</h2>
        <p class="mt-1 text-sm text-slate-500">Use the name exactly as it appears on your records.</p>

        <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label for="fullName" class="label">Full name</label>
            <input id="fullName" v-model="form.fullName" type="text" class="input" placeholder="e.g. Sok Dara" autocomplete="name" required />
          </div>

          <div>
            <label for="batch" class="label">Batch</label>
            <input id="batch" v-model="form.batch" type="text" class="input" placeholder="e.g. 2016" required />
            <p class="hint">The year you graduated.</p>
          </div>

          <div>
            <label for="contact" class="label">Phone or email</label>
            <input id="contact" v-model="form.contact" type="text" class="input" placeholder="012 345 678" autocomplete="email" required />
            <p class="hint">We'll contact you when it's ready.</p>
          </div>
        </div>
      </section>

      <!-- Documents -->
      <section class="p-6 sm:p-8">
        <h2 class="text-base font-semibold text-slate-900">Documents</h2>
        <p class="mt-1 text-sm text-slate-500">Choose what you need and how many papers.</p>

        <!-- Copy or new -->
        <fieldset class="mt-6">
          <legend class="label">Copy or new document?</legend>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label
              v-for="kind in REQUEST_KINDS"
              :key="kind.value"
              class="relative flex cursor-pointer flex-col rounded-lg border p-4 transition focus-within:ring-4 focus-within:ring-brand-100"
              :class="form.requestKind === kind.value
                ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500'
                : 'border-slate-300 bg-white hover:border-slate-400'"
            >
              <input v-model="form.requestKind" type="radio" name="requestKind" :value="kind.value" class="sr-only" required />
              <span class="text-sm font-semibold text-slate-900">{{ kind.label }}</span>
              <span class="mt-0.5 text-xs text-slate-500">{{ kind.desc }}</span>
              <span class="mt-2 text-xs font-medium text-slate-700">
                Transcript {{ formatUSD(PRICES[kind.value].Transcript) }} · Certificate {{ formatUSD(PRICES[kind.value].Certificate) }}
              </span>
              <svg
                v-if="form.requestKind === kind.value"
                class="absolute right-3 top-3 h-5 w-5 text-brand-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
              </svg>
            </label>
          </div>
        </fieldset>

        <fieldset class="mt-6">
          <legend class="label">Document type</legend>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label
              v-for="opt in types"
              :key="opt.value"
              class="relative flex cursor-pointer flex-col rounded-lg border p-4 transition focus-within:ring-4 focus-within:ring-brand-100"
              :class="form.requestType === opt.value
                ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500'
                : 'border-slate-300 bg-white hover:border-slate-400'"
            >
              <input v-model="form.requestType" type="radio" name="requestType" :value="opt.value" class="sr-only" required />
              <span class="text-sm font-semibold text-slate-900">{{ opt.value }}</span>
              <span class="mt-0.5 text-xs text-slate-500">{{ opt.desc }}</span>
              <svg
                v-if="form.requestType === opt.value"
                class="absolute right-3 top-3 h-5 w-5 text-brand-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
              </svg>
            </label>
          </div>
        </fieldset>

        <div v-if="needsTranscript || needsCertificate" class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div v-if="needsTranscript">
            <label for="transcriptCount" class="label">Number of transcripts</label>
            <input id="transcriptCount" v-model="form.transcriptCount" type="number" min="1" max="100" step="1" class="input" placeholder="1" required />
          </div>
          <div v-if="needsCertificate">
            <label for="certificateCount" class="label">Number of certificates</label>
            <input id="certificateCount" v-model="form.certificateCount" type="number" min="1" max="100" step="1" class="input" placeholder="1" required />
          </div>
        </div>

        <!-- Price breakdown -->
        <dl v-if="lines.length" class="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200 text-sm">
          <div v-for="line in lines" :key="line.label" class="flex items-center justify-between px-4 py-3">
            <dt class="text-slate-600">
              {{ line.label }}
              <span class="text-slate-400">· {{ line.qty }} × {{ formatUSD(line.unit) }}</span>
            </dt>
            <dd class="font-medium tabular-nums text-slate-900">{{ formatUSD(line.qty * line.unit) }}</dd>
          </div>
        </dl>
      </section>

      <!-- Footer -->
      <div class="flex flex-col-reverse gap-4 rounded-b-xl bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p class="text-sm text-slate-600">
          Total to pay:
          <span class="text-base font-semibold tabular-nums text-slate-900">{{ formatUSD(total) }}</span>
        </p>
        <button type="submit" class="btn-primary w-full sm:w-auto" :disabled="loading">
          <svg v-if="loading" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
          </svg>
          {{ loading ? "Submitting…" : "Submit request" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { PRICES, REQUEST_KINDS, formatUSD } from "@/pricing";
import { createRequest, rememberCode } from "@/requests";
import { isConfigured } from "@/firebase";

const types = [
  { value: "Transcript", desc: "Official academic transcript" },
  { value: "Certificate", desc: "Certificate of completion" },
  { value: "Both", desc: "Transcript and certificate" },
];

const emptyForm = () => ({
  fullName: "",
  batch: "",
  contact: "",
  requestKind: "",
  requestType: "",
  transcriptCount: "",
  certificateCount: "",
});

const form = ref(emptyForm());
const success = ref(false);
const submittedTotal = ref(0);
const submittedCode = ref("");
const copied = ref(false);

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(submittedCode.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    /* clipboard unavailable; code is visible on screen */
  }
};
const error = ref("");
const loading = ref(false);

const needsTranscript = computed(() => ["Transcript", "Both"].includes(form.value.requestType));
const needsCertificate = computed(() => ["Certificate", "Both"].includes(form.value.requestType));

const lines = computed(() => {
  const prices = PRICES[form.value.requestKind];
  if (!prices) return [];
  const kind = form.value.requestKind === "New" ? "new" : "copy";
  const out = [];
  if (needsTranscript.value) {
    out.push({ label: `Transcript (${kind})`, qty: Number(form.value.transcriptCount) || 0, unit: prices.Transcript });
  }
  if (needsCertificate.value) {
    out.push({ label: `Certificate (${kind})`, qty: Number(form.value.certificateCount) || 0, unit: prices.Certificate });
  }
  return out;
});

const total = computed(() => lines.value.reduce((sum, l) => sum + l.qty * l.unit, 0));

// Firestore waits indefinitely when it can't reach the server; give up after 20s.
const withTimeout = (promise, ms = 20000) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))]);

const handleSubmit = async () => {
  if (loading.value) return;
  loading.value = true;
  success.value = false;
  error.value = "";

  try {
    if (!isConfigured) throw new Error("Firebase is not configured");
    const f = form.value;
    const code = await withTimeout(createRequest({
      fullName: f.fullName.trim(),
      batch: String(f.batch).trim(),
      contact: f.contact.trim(),
      requestKind: f.requestKind,
      requestType: f.requestType,
      // 0 for document types that weren't selected.
      transcriptCount: needsTranscript.value ? parseInt(f.transcriptCount, 10) || 0 : 0,
      certificateCount: needsCertificate.value ? parseInt(f.certificateCount, 10) || 0 : 0,
      totalPrice: total.value,
    }));
    rememberCode(code);
    submittedCode.value = code;
    submittedTotal.value = total.value;
    success.value = true;
    form.value = emptyForm();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("Error:", err);
    error.value =
      err?.code === "permission-denied"
        ? "The request was rejected by the server. Please contact the office if this keeps happening."
        : err?.message === "timeout"
          ? "The server took too long to respond. Please check your connection and try again."
          : "We couldn't submit your request. Please check your connection and try again.";
  } finally {
    loading.value = false;
  }
};
</script>
