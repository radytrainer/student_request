<template>
  <span
    class="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
    :class="style.cls"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="style.dot"></span>
    {{ statusLabel(status) }}
  </span>
</template>

<script setup>
import { computed } from "vue";
import { STATUS_STYLE, statusLabel } from "@/requests";

const props = defineProps({ status: { type: String, default: "" } });
const style = computed(() => STATUS_STYLE[props.status] ?? STATUS_STYLE.collected);
</script>
