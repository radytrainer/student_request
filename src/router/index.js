import { createRouter, createWebHistory } from "vue-router";
import Form from "../components/Form.vue";
import DataList from "../components/DataList.vue";

const routes = [
  { path: "/", redirect: "/form" }, // default redirect
  { path: "/form", component: Form },
  { path: "/data", component: DataList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
