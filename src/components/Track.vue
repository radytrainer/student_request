<template>
  <div class="mx-auto max-w-2xl">
    <div class="mb-8">
      <h1 class="page-title">Track your request</h1>
      <p class="page-subtitle">Enter the tracking code you received after submitting your request.</p>
    </div>

    <form class="card flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:p-6" @submit.prevent="lookup">
      <div class="flex-1">
        <label for="code" class="label">Tracking code</label>
        <input
          id="code"
          v-model="input"
          type="text"
          class="input font-mono uppercase tracking-[0.2em] placeholder:font-sans placeholder:normal-case placeholder:tracking-normal"
          placeholder="e.g. K7M2QX"
          maxlength="8"
          autocomplete="off"
          spellcheck="false"
          required
        />
      </div>
      <button type="submit" class="btn-primary">Track</button>
    </form>

    <!-- Codes from this device -->
    <div v-if="!code && recent.length" class="mt-4 text-sm text-slate-600">
      Your recent requests on this device:
      <router-link
        v-for="c in recent"
        :key="c"
        :to="`/track/${c}`"
        class="ml-2 inline-block rounded-md bg-white px-2 py-0.5 font-mono font-medium text-brand-700 ring-1 ring-slate-200 hover:bg-brand-50"
      >
        {{ c }}
      </router-link>
    </div>

    <p v-if="!code" class="mt-4 text-sm text-slate-500">
      Forgot your code? Contact the PNC office with your full name and batch, and we'll send it to you.
    </p>

    <!-- Result -->
    <div v-if="code" class="mt-6">
      <div v-if="loading" class="card p-10 text-center text-sm text-slate-500">Looking up {{ code }}…</div>

      <div v-else-if="error" class="card p-10 text-center">
        <p class="text-sm font-medium text-slate-900">Couldn't load this request</p>
        <p class="mt-1 text-sm text-slate-500">{{ error }}</p>
      </div>

      <div v-else-if="!item" class="card p-10 text-center">
        <p class="text-sm font-medium text-slate-900">No request found for “{{ code }}”</p>
        <p class="mt-1 text-sm text-slate-500">Check the code and try again.</p>
      </div>

      <div v-else class="card overflow-hidden">
        <div class="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 p-6">
          <div>
            <p class="font-mono text-sm font-semibold tracking-[0.2em] text-slate-500">{{ item.id }}</p>
            <p class="mt-1 text-lg font-semibold text-slate-900">{{ item.name }}</p>
            <p class="text-sm text-slate-500">
              Batch {{ item.batch }} · {{ item.requestKind === "New" ? "New" : "Copy" }} · {{ describeDocs(item) }}
            </p>
          </div>
          <StatusBadge :status="item.status" />
        </div>

        <!-- Progress steps -->
        <ol class="p-6">
          <li v-for="(step, i) in STATUSES" :key="step.id" class="relative flex gap-4 pb-8 last:pb-0">
            <span
              v-if="i < STATUSES.length - 1"
              class="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5"
              :class="i < current ? 'bg-brand-600' : 'bg-slate-200'"
              aria-hidden="true"
            ></span>

            <span
              class="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
              :class="i < current
                ? 'bg-brand-600 text-white'
                : i === current
                  ? 'bg-white text-brand-700 ring-2 ring-brand-600'
                  : 'bg-white text-slate-400 ring-2 ring-slate-200'"
            >
              <svg v-if="i < current || (i === current && i === STATUSES.length - 1)" class="h-4 w-4" :class="i === current ? 'text-brand-700' : ''" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" />
              </svg>
              <template v-else>{{ i + 1 }}</template>
            </span>

            <div class="min-w-0 pt-1">
              <p class="text-sm font-semibold" :class="i <= current ? 'text-slate-900' : 'text-slate-400'">
                {{ step.label }}
                <span v-if="i === current && i < STATUSES.length - 1" class="ml-2 text-xs font-medium text-brand-600">Current</span>
              </p>
              <p class="text-sm" :class="i <= current ? 'text-slate-500' : 'text-slate-400'">{{ step.desc }}</p>
              <p v-if="item.timeline?.[step.id]" class="mt-1 text-xs font-medium text-slate-600">
                {{ formatDateTime(item.timeline[step.id]) }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import StatusBadge from "./StatusBadge.vue";
import { STATUSES, statusIndex, watchTrackingCode, normalizeCode, myCodes } from "@/requests";
import { isConfigured } from "@/firebase";
import { formatDateTime, describeDocs } from "@/format";

const route = useRoute();
const router = useRouter();

const code = computed(() => normalizeCode(route.params.code));
const input = ref(code.value);
const recent = myCodes();

const item = ref(null);
const loading = ref(false);
const error = ref("");
const current = computed(() => statusIndex(item.value?.status));

let unsubscribe = null;
let timer = null;

const stop = () => {
  unsubscribe?.();
  unsubscribe = null;
  clearTimeout(timer);
};

watch(
  code,
  (c) => {
    stop();
    item.value = null;
    error.value = "";
    if (!c) return;
    input.value = c;
    if (!isConfigured) {
      error.value = "Firebase is not configured.";
      return;
    }
    loading.value = true;
    timer = setTimeout(() => {
      if (loading.value) {
        loading.value = false;
        error.value = "Can't reach the database. Please check your connection.";
      }
    }, 15000);
    unsubscribe = watchTrackingCode(
      c,
      (data) => {
        clearTimeout(timer);
        item.value = data;
        loading.value = false;
      },
      (err) => {
        clearTimeout(timer);
        console.error(err);
        loading.value = false;
        error.value = "Please check your connection and try again.";
      },
    );
  },
  { immediate: true },
);

onUnmounted(stop);

const lookup = () => {
  const c = normalizeCode(input.value);
  if (c) router.push(`/track/${c}`);
};
</script>
