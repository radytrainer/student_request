import { createRouter, createWebHistory } from "vue-router";
import Form from "../components/Form.vue";
import Track from "../components/Track.vue";
import Payment from "@/components/Payment.vue";

const Admin = () => import("@/components/Admin.vue");

const routes = [
  { path: "/", redirect: "/form" },
  { path: "/form", component: Form },
  { path: "/payment_screenshot", component: Payment },
  { path: "/queue", redirect: "/track" }, // removed page
  { path: "/data", redirect: "/track" }, // old link
  { path: "/track/:code?", component: Track },
  { path: "/admin", component: Admin },
  { path: "/:pathMatch(.*)*", redirect: "/form" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
});

export default router;
