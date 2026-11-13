<template>
  <div ref="root" class="relative inline-block">
    <button
      type="button"
      class="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-brand-700 hover:bg-brand-50"
      :aria-expanded="open"
      @click="toggle"
    >
      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
      </svg>
      Send code
    </button>

    <div
      v-if="open"
      class="fixed z-50 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-sm shadow-lg"
      :style="pos"
    >
      <button type="button" class="menu-item" @click="copy">
        {{ copied ? "Copied!" : "Copy message" }}
      </button>
      <a v-if="email" class="menu-item" :href="mailto" @click="open = false">Send by email</a>
      <template v-if="phone">
        <a class="menu-item" :href="telegram" target="_blank" rel="noopener" @click="copy">Open in Telegram</a>
        <a class="menu-item" :href="sms" @click="open = false">Send by SMS</a>
      </template>
      <p class="border-t border-slate-100 px-3 pb-1 pt-2 text-xs text-slate-500">
        <template v-if="phone">Telegram opens a chat; the message is copied so you can paste it.</template>
        <template v-else-if="!email">Contact isn't an email or phone. Copy the message and send it manually.</template>
        <template v-else>Opens your email app with the message ready.</template>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({ row: { type: Object, required: true } });

const open = ref(false);
const copied = ref(false);
const root = ref(null);
const pos = ref({});

// Fixed positioning so the table's scroll container can't clip the menu.
const toggle = (e) => {
  if (open.value) return (open.value = false);
  const r = e.currentTarget.getBoundingClientRect();
  const menuHeight = 200;
  const below = r.bottom + 4 + menuHeight < window.innerHeight;
  pos.value = {
    left: `${Math.min(r.left, window.innerWidth - 232)}px`,
    ...(below ? { top: `${r.bottom + 4}px` } : { bottom: `${window.innerHeight - r.top + 4}px` }),
  };
  open.value = true;
};
const close = () => (open.value = false);

const contact = computed(() => String(props.row.contact ?? "").trim());
const email = computed(() => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.value) ? contact.value : ""));

// Cambodian numbers: "012 345 678" / "+855 12 345 678" -> "+85512345678"
const phone = computed(() => {
  if (email.value) return "";
  const digits = contact.value.replace(/[^\d+]/g, "");
  if (/^\+\d{8,15}$/.test(digits)) return digits;
  if (/^855\d{8,9}$/.test(digits)) return `+${digits}`;
  if (/^0\d{8,9}$/.test(digits)) return `+855${digits.slice(1)}`;
  return "";
});

const message = computed(() => {
  const link = `${window.location.origin}/track/${props.row.id}`;
  return [
    `Hello ${props.row.fullName},`,
    ``,
    `Your PNC document request tracking code is: ${props.row.id}`,
    `Check your progress here: ${link}`,
    ``,
    `Passerelles Numériques Cambodia`,
  ].join("\n");
});

const subject = "Your PNC document request tracking code";
const mailto = computed(
  () => `mailto:${email.value}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message.value)}`,
);
const telegram = computed(() => `https://t.me/${phone.value}`);
const sms = computed(() => `sms:${phone.value}?body=${encodeURIComponent(message.value)}`);

const copy = async () => {
  try {
    await navigator.clipboard.writeText(message.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
      open.value = false;
    }, 1200);
  } catch {
    window.prompt("Copy this message:", message.value);
    open.value = false;
  }
};

const onClickOutside = (e) => {
  if (open.value && root.value && !root.value.contains(e.target)) open.value = false;
};
onMounted(() => {
  document.addEventListener("click", onClickOutside);
  window.addEventListener("scroll", close, true);
  window.addEventListener("resize", close);
});
onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
  window.removeEventListener("scroll", close, true);
  window.removeEventListener("resize", close);
});
</script>

<style scoped>
.menu-item {
  @apply block w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50;
}
</style>
