<template>
  <div class="space-y-6 bg-white text-black dark:bg-black dark:text-white p-4 rounded">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">소통 관리</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
      예약 정보를 관리하고 상태를 확인할 수 있습니다.
    </p>
    <!-- 통계 카드 -->
    <DashboardStats :stats="stats" />
  </div>
</template>

<script setup></script>
