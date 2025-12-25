import { createRouter, createWebHistory } from "vue-router";
import Form from "../components/Form.vue";
import DataList from "../components/DataList.vue";
import Payment from "@/components/Payment.vue";

const routes = [
  { path: "/", redirect: "/form" }, // default redirect
  { path: "/form", component: Form },
  { path: "/data", component: DataList },
  { path: "/payment_screenshot", component: Payment}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
