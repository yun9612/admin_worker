import AdminHome from "@/pages/admin/AdminHome.vue";
import Communication from "@/pages/admin/Communication.vue";
import Customers from "@/pages/admin/Customers.vue";
import Dashboard_admin from "@/pages/admin/Dashboard_admin.vue";
import Inquiries from "@/pages/admin/Inquiries.vue";
import LoginAdmin from "@/pages/admin/LoginAdmin.vue";
import Reservations from "@/pages/admin/Reservations.vue";
import Settings from "@/pages/admin/Settings.vue";
import Worker_admin from "@/pages/admin/Worker_admin.vue";
import Calendar from "@/pages/worker/Calendar.vue";
import Dashboard from "@/pages/worker/Dashboard.vue";
import Detail from "@/pages/worker/Detail.vue";
import Jobs from "@/pages/worker/Jobs.vue";
import LoginWorker from "@/pages/worker/LoginWorker.vue";
import Payment from "@/pages/worker/Payment.vue";
import Home from "@/views/Home.vue";
import Reser from "@/views/Reser.vue";
import Review from "@/views/Review.vue";
import { createRouter, createWebHistory } from "vue-router";
const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/reser", component: Reser, name: "Reser" },
  { path: "/review", component: Review, name: "Review" },
  // 관리자 페이지
  { path: "/admin", component: LoginAdmin, name: "LoginAdmin" },
  {
    path: "/admin",
    component: AdminHome,
    redirect: "admin/dashboard",
    children: [
      { path: "dashboard", component: Dashboard_admin },
      { path: "reservations", component: Reservations },
      { path: "workers", component: Worker_admin },
      { path: "customers", component: Customers },
      { path: "inquiries", component: Inquiries },
      { path: "customer-communication", component: Communication },
      { path: "settings", component: Settings },
    ],
  },
  // 기사 페이지
  { path: "/worker", component: LoginWorker, name: "LoginWorker" },
  {
    path: "/worker/dashboard",
    component: Dashboard,
    redirect: "/worker/dashboard/jobs",
    children: [
      { path: "jobs", component: Jobs, name: "MobileJobs" },
      { path: "calendar", component: Calendar, name: "MobileCalendar" },
      { path: "payment", component: Payment, name: "MobilePayment" },
      { path: "detail/:id?", component: Detail, name: "WorkerDetail" },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
