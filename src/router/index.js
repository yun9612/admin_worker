import AdminHome from "@/pages/admin/AdminHome.vue";
import Communication from "@/pages/admin/Communication.vue";
import Customer from "@/pages/admin/Customer.vue";
import DashboardAdmin from "@/pages/admin/DashboardAdmin.vue";
import Inquiries from "@/pages/admin/Inquiries.vue";
import LoginAdmin from "@/pages/admin/LoginAdmin.vue";
import Reservations from "@/pages/admin/Reservations.vue";
import Settings from "@/pages/admin/Settings.vue";
import WorkerAdmin from "@/pages/admin/WorkerAdmin.vue";
import Calendar from "@/pages/worker/Calendar.vue";
import DashboardWorker from "@/pages/worker/DashboardWorker.vue";
import Jobs from "@/pages/worker/Jobs.vue";
import LoginWorker from "@/pages/worker/LoginWorker.vue";
import Payment from "@/pages/worker/Payment.vue";
import HomeVue from "@/views/Home.vue";
import ReserVue from "@/views/Reser.vue";
import ReviewVue from "@/views/Review.vue";
import { createRouter, createWebHistory } from "vue-router";
const routes = [
  { path: "/", component: HomeVue, name: "HomeVue" },
  { path: "/reser", component: ReserVue, name: "ReserVue" },
  { path: "/review", component: ReviewVue, name: "ReviewVue" },
  // 관리자 페이지
  { path: "/admin", component: LoginAdmin, name: "LoginAdmin" },
  {
    path: "/admin",
    component: AdminHome,
    redirect: "admin/dashboard", // 제일 먼저 연결되는 자식
    children: [
      { path: "dashboard", component: DashboardAdmin, name: "DashboardAdmin" },
      { path: "reservations", component: Reservations, name: "Reservations" },
      { path: "workers", component: WorkerAdmin, name: "WorkerAdmin" },
      { path: "customers", component: Customer, name: "Customer" },
      { path: "inquiries", component: Inquiries, name: "Inquiries" },
      { path: "communication", component: Communication, name: "Communication" },
      { path: "settings", component: Settings, name: "Settings" },
    ],
  },

  // 기사 페이지
  { path: "/worker", component: LoginWorker, name: "LoginWorker" },
  {
    path: "/worker/dashboard",
    component: DashboardWorker,
    redirect: "worker/dashboard/jobs",
    children: [
      { path: "jobs", component: Jobs, name: "MobileJobs" },
      { path: "calendar", component: Calendar, name: "MobileCalendar" },
      { path: "payment", component: Payment, name: "MobilePayment" },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
