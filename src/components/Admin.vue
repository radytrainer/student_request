<template>
  <!-- Checking session -->
  <div v-if="checking" class="flex justify-center py-24">
    <svg class="h-6 w-6 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
    </svg>
  </div>

  <!-- Sign in -->
  <div v-else-if="!user" class="mx-auto max-w-sm py-8">
    <div class="mb-8 text-center">
      <h1 class="page-title">Staff sign in</h1>
      <p class="page-subtitle">Manage requests and update their progress.</p>
    </div>
    <form class="card space-y-5 p-6 sm:p-8" @submit.prevent="signIn">
      <div v-if="!isConfigured" class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        Firebase is not configured. Add your project settings to <code>.env.local</code>.
      </div>
      <div>
        <label for="email" class="label">Email</label>
        <input id="email" v-model="email" type="email" class="input" autocomplete="username" required />
      </div>
      <div>
        <label for="password" class="label">Password</label>
        <input id="password" v-model="password" type="password" class="input" autocomplete="current-password" required />
      </div>
      <p v-if="authError" class="text-sm text-red-600" role="alert">{{ authError }}</p>
      <button type="submit" class="btn-primary w-full" :disabled="signingIn || !isConfigured">
        {{ signingIn ? "Signing in…" : "Sign in" }}
      </button>
    </form>
  </div>

  <!-- Signed in but not staff -->
  <div v-else-if="!staff" class="mx-auto max-w-md py-16 text-center">
    <h1 class="text-xl font-semibold text-slate-900">No staff access</h1>
    <p class="mt-2 text-sm text-slate-500">
      {{ user.email }} is signed in but isn't on the staff list. Ask an administrator to add your account.
    </p>
    <button type="button" class="btn-secondary mt-6" @click="signOutUser">Sign out</button>
  </div>

  <!-- Dashboard -->
  <div v-else>
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="page-title">Manage requests</h1>
        <p class="page-subtitle">Signed in as {{ user.email }}</p>
      </div>
      <button type="button" class="btn-secondary self-start sm:self-auto" @click="signOutUser">Sign out</button>
    </div>

    <div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      <div v-for="s in stats" :key="s.label" class="card p-4">
        <p class="text-xs font-medium text-slate-500">{{ s.label }}</p>
        <p class="mt-1.5 text-xl font-semibold tabular-nums text-slate-900">{{ s.value }}</p>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
          <button
            v-for="f in filters"
            :key="f.id"
            type="button"
            class="rounded-md px-3 py-1.5 text-sm font-medium transition"
            :class="statusFilter === f.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'"
            @click="statusFilter = f.id"
          >
            {{ f.label }}
            <span class="ml-1 tabular-nums text-slate-400">{{ countFor(f.id) }}</span>
          </button>
        </div>
        <input v-model="search" type="search" placeholder="Search name, code, batch or contact" class="input lg:w-72" aria-label="Search" />
      </div>

      <p v-if="dataError" class="p-6 text-sm text-red-600" role="alert">{{ dataError }}</p>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50">
            <tr class="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th scope="col" class="px-4 py-3">Code</th>
              <th scope="col" class="px-4 py-3">Student</th>
              <th scope="col" class="px-4 py-3">Contact</th>
              <th scope="col" class="px-4 py-3">Request</th>
              <th scope="col" class="px-4 py-3 text-right">Total</th>
              <th scope="col" class="px-4 py-3">Status</th>
              <th scope="col" class="px-4 py-3">Last update</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <tr v-for="row in filtered" :key="row.id" class="align-top hover:bg-slate-50">
              <td class="whitespace-nowrap px-4 py-3">
                <p class="font-mono font-medium tracking-wider text-slate-900">{{ row.id }}</p>
                <p class="text-xs text-slate-500">{{ formatDateTime(row.createdAt) || "Just now" }}</p>
                <div class="-ml-1.5 mt-1"><SendCode :row="row" /></div>
              </td>
              <td class="px-4 py-3">
                <p class="font-medium text-slate-900">{{ row.fullName }}</p>
                <p class="text-xs text-slate-500">Batch {{ row.batch }}</p>
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-slate-700">{{ row.contact || "—" }}</td>
              <td class="px-4 py-3 text-slate-700">
                <p class="font-medium">{{ row.requestKind === "New" ? "New" : "Copy" }}</p>
                <p class="text-xs text-slate-500">{{ describeDocs(row) }}</p>
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-slate-900">{{ formatUSD(row.totalPrice) }}</td>
              <td class="px-4 py-3">
                <div class="flex flex-col gap-2">
                  <select
                    :value="row.status"
                    class="input w-40 py-1.5"
                    :disabled="saving[row.id]"
                    :aria-label="`Status for ${row.fullName}`"
                    @change="updateStatus(row, $event.target.value)"
                  >
                    <option v-for="s in STATUSES" :key="s.id" :value="s.id">{{ s.label }}</option>
                  </select>
                  <button
                    v-if="row.status === 'completed'"
                    type="button"
                    class="btn-primary w-40 py-1.5 text-xs"
                    :disabled="saving[row.id]"
                    @click="updateStatus(row, 'collected')"
                  >
                    Mark collected
                  </button>
                </div>
              </td>
              <td class="whitespace-nowrap px-4 py-3">
                <template v-if="row.status === 'collected'">
                  <p class="text-xs font-medium text-slate-700">Collected</p>
                  <p class="text-xs text-slate-500">{{ formatDateTime(row.timeline?.collected) || "Just now" }}</p>
                </template>
                <template v-else>
                  <p class="text-xs font-medium text-slate-700">{{ statusLabel(row.status) }}</p>
                  <p class="text-xs text-slate-500">{{ formatDateTime(row.timeline?.[row.status]) || "Just now" }}</p>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-if="!filtered.length" class="p-12 text-center text-sm text-slate-500">No requests found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, watch } from "vue";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, isConfigured } from "@/firebase";
import { STATUSES, statusLabel, watchRequests, setStatus, isStaff } from "@/requests";
import { formatUSD } from "@/pricing";
import { formatDateTime, describeDocs } from "@/format";
import SendCode from "./SendCode.vue";

const checking = ref(true);
const user = ref(null);
const staff = ref(false);

const email = ref("");
const password = ref("");
const signingIn = ref(false);
const authError = ref("");

const requests = ref([]);
const dataError = ref("");
const saving = ref({});
const search = ref("");
const statusFilter = ref("active");

const filters = [
  { id: "active", label: "Active" },
  ...STATUSES.map((s) => ({ id: s.id, label: s.label })),
  { id: "all", label: "All" },
];

const matchesFilter = (r, f) => (f === "all" ? true : f === "active" ? r.status !== "collected" : r.status === f);
const countFor = (f) => requests.value.filter((r) => matchesFilter(r, f)).length;

let stopData = null;

const stopAuth = isConfigured
  ? onAuthStateChanged(auth, async (u) => {
      user.value = u;
      staff.value = u ? await isStaff(u.uid) : false;
      checking.value = false;
    })
  : ((checking.value = false), () => {});

watch(staff, (isStaffUser) => {
  stopData?.();
  stopData = null;
  if (!isStaffUser) return;
  stopData = watchRequests(
    (rows) => {
      requests.value = rows;
      dataError.value = "";
    },
    (err) => {
      console.error(err);
      dataError.value = "Couldn't load requests. Check your connection or permissions.";
    },
  );
});

onUnmounted(() => {
  stopAuth();
  stopData?.();
});

const signIn = async () => {
  signingIn.value = true;
  authError.value = "";
  try {
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value);
    password.value = "";
  } catch (err) {
    authError.value = ["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found"].includes(err.code)
      ? "Incorrect email or password."
      : "Sign in failed. Please try again.";
  } finally {
    signingIn.value = false;
  }
};

const signOutUser = () => signOut(auth);

const updateStatus = async (row, status) => {
  if (status === row.status) return;
  saving.value = { ...saving.value, [row.id]: true };
  try {
    await setStatus(row.id, status);
  } catch (err) {
    console.error(err);
    alert("Couldn't update status. Please try again.");
  } finally {
    saving.value = { ...saving.value, [row.id]: false };
  }
};

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  return requests.value.filter((r) => {
    if (!matchesFilter(r, statusFilter.value)) return false;
    if (!q) return true;
    return [r.id, r.fullName, r.batch, r.contact].some((v) => String(v ?? "").toLowerCase().includes(q));
  });
});

const stats = computed(() => {
  const by = (s) => requests.value.filter((r) => r.status === s).length;
  const billed = requests.value.reduce((sum, r) => sum + (Number(r.totalPrice) || 0), 0);
  return [...STATUSES.map((s) => ({ label: s.label, value: by(s.id) })), { label: "Total billed", value: formatUSD(billed) }];
});
</script>
