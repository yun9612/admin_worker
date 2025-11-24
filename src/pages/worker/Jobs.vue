<template>
  <div class="w-full">
    <!-- 필터 상태별 보기 -->
    <div class="px-4 pt-3">
      <div class="flex gap-2">
        <button
          class="px-4 py-2 rounded-full text-sm border shadow-sm active:scale-[0.98] transition-colors"
          @click="setFilter(label)"
          :class="btnClass(label)"
          v-for="label in filterLabels"
          :key="label">
          {{ label }}
        </button>
      </div>
    </div>
    <!-- 작업 카드 리스트 -->
    <ul class="px-4 py-3 space-y-3" role="list">
      <li
        v-for="job in filteredJobs"
        :key="job.id"
        class="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 shadow-[0_1px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.2)] cursor-pointer">
        <div class="flex items-start gap-3">
          <div
            :class="
              job.type === 'store'
                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
            "
            class="w-11 h-11 rounded-xl flex items-center justify-center text-lg ring-1 ring-black/5">
            🏪
          </div>
          <div class="flex-1">
            <p
              class="font-semibold text-base flex items-center justify-between text-gray-900 dark:text-white">
              <span>
                {{ job.storeName }}
                <span class="text-gray-400 dark:text-gray-500">- {{ job.time }}</span>
              </span>
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ job.address }}</p>
            <div class="mt-2 flex items-center gap-2">
              <span
                :class="statusBadge(job.status)"
                class="text-[11px] px-2 py-1 rounded-full font-medium">
                {{ statusText(job.status) }}
              </span>
              <span
                v-if="job.memo"
                class="text-[11px] px-2 py-1 rounded-full bg-orange-100 text-orange-600">
                📌 {{ job.memo }}
              </span>
            </div>
            <!-- 선택/저장된 사진 썸네일 미리보기 -->
            <div class="mt-2 grid grid-cols-3 gap-1" v-if="job.photos && job.photos.length">
              <img
                class="w-full h-12 object-cover rounded-md border"
                v-for="(src, i) in job.photos"
                :key="i"
                :src="src"
                :alt="`저장된 사진 ${i + 1}`" />
            </div>
            <!-- 작업 시작 버튼 -->
            <div v-if="job.status !== 'done'" class="mt-2">
              <button
                @click="gotoWorkDetail(job)"
                class="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 active:scale-[0.98]">
                작업 시작
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <!-- 작업 리스트가 비어있을 때 -->
    <div
      class="px-4 pb-4 text-center text-sm text-gray-500 dark:text-gray-400"
      v-if="filteredJobs.length === 0">
      할당된 청소 작업이 없습니다.
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { jobs } from "@/data/worker_jobs";
import { useRouter } from "vue-router";

const router = useRouter();
const currentFilter = ref("전체");
const filterLabels = ["전체", "예약", "이동중", "작업중", "완료"];

function btnClass(label) {
  return isActive(label)
    ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500"
    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600";
}
function isActive(label) {
  return currentFilter.value === label;
}

// 버튼 클릭시
function setFilter(label) {
  currentFilter.value = label;
}

const statusMap = {
  전체: "all",
  예약: "scheduled",
  이동중: "onroute",
  작업중: "working",
  완료: "done",
};

// 작업 목록 필터링
const filteredJobs = computed(() => {
  const key = statusMap[currentFilter.value];
  // console.log(key);
  if (key === "all") return jobs.value;
  return jobs.value.filter((j) => j.status === key);
});
// 상태 이름 변경
function statusText(status) {
  switch (status) {
    case "scheduled":
      return "예약";
    case "onroute":
      return "이동중";
    case "working":
      return "작업중";
    case "done":
      return "완료";
    default:
      return status;
  }
}
// 상태 css 변경
function statusBadge(status) {
  switch (status) {
    case "scheduled":
      return "bg-blue-50 text-blue-700";
    case "onroute":
      return "bg-yellow-50 text-yellow-700";
    case "working":
      return "bg-orange-50 text-orange-700";
    case "done":
      return "bg-green-50 text-green-700";
    default:
      return "bg-gray-50 text-gray-700";
  }
}

// 작업 상세 페이지 이동(작업 ID를 쿼리 파라미터로 전달)
function gotoWorkDetail(job) {
  router.push({
    name: "WorkerDetail",
    query: { jobId: job.id },
  });
}
</script>
