<template>
  <div class="w-full">
    <!-- 검색 및 필터 영역 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- 검색 입력 -->
        <div class="flex-1">
          <div class="relative">
            <input
              v-model="localSearchQuery"
              @input="handleInput"
              type="text"
              :placeholder="searchPlaceholder"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            <i class="fas fa-search absolute left-3 top-3 text-gray-400 dark:text-gray-500"></i>
          </div>
        </div>
        <!-- 필터 선택 (있는 경우만 표시) -->
        <div class="flex gap-2" v-if="filterOptions && filterOptions.length > 0">
          <select
            v-for="(filter, index) in filterOptions"
            :key="index"
            v-model="localFilters[filter.key]"
            @change="handleFilterChange"
            class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option v-for="option in filter.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- 테이블영역 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div v-if="tableTitle" class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
          {{ tableTitle }}
        </h2>
      </div>
      <!-- 테이블 목록 -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {{ column.label }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td
                v-for="column in columns"
                :key="column.key"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                <span v-html="renderCell(item, column)"></span>
              </td>
            </tr>
            <!-- 데이터가 없을때  -->
            <tr v-if="filteredData.length === 0">
              <td :colspan="columns.length" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                데이터가 없습니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 페이지 네이션 영역 -->
    <div class="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        총 <span>{{ filteredData.length }}</span
        >{{ totalLabel }}
      </div>
      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="[
            currentPage === page
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300',
            'px-3 py-1 border rounded',
          ]">
          {{ page }}
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from "vue";
// 로컬 상태

const localSearchQuery = ref("");
const localFilters = ref({});
const emit = defineEmits(["row-click"])
// Props 정의
const props = defineProps({
  // 전체 데이터 배열
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 검색 플레이스홀더
  searchPlaceholder: {
    type: String,
    default: "검색...",
  },
  //   필터 옵션
  filterOptions: {
    type: Array,
    default: () => [],
  },
  //   검색할 필드명 배열
  searchFields: {
    type: Array,
    default: () => [],
  },
  // 테이블 제목
  tableTitle: {
    type: String,
    default: "",
  },
  // 테이블 컬럼 정의
  columns: {
    type: Array,
    required: true,
  },
  // 페이지당 아이템 수
  itemsPerPage: {
    type: Number,
    default: 5,
  },
  // 총 개수 라벨(예:'명의 가사' , "건의 예약")
  totalLabel: {
    type: String,
    default: "개",
  },
  // 필터 함수(커스텀 필터링 로직)
  filterFn: {
    type: Function,
    default: null,
  },
});
// 한글 입력해도 바로 검색이 되도록 하는 함수
function handleInput(event) {
  localSearchQuery.value = event.target.value;
  // 검색 할때는 첫 번째 페이지부터 다시 보기
  currentPage.value = 1;
}
// 필터 가 바뀔때 실행되는 함수
const handleFilterChange = () => {
  currentPage.value = 1;
};
// 필터 초기화
//  만약에 필터 옵션이 있고 그안에 내용이 있다면
if (props.filterOptions && props.filterOptions.length > 0) {
  // 각 필터를 하나씩 꺼내서
  props.filterOptions.forEach((filter) => {
    // localFilters.value[filter.key] =
    // console.log(filter);
    // ?기능은 옵션이 있으면 첫번째 값 넣어주고 없으면 빈 문자열을 넣어준다.
    localFilters.value[filter.key] = filter.options[0]?.value || "";
  });
}
const currentPage = ref(1);
// 화면에 보여줄 데이터를 계산하는곳
const filteredData = computed(() => {
  // props.data를 그대로 복사해서 result에 저장
  let result = [...props.data];

  // 🔎 검색창에 글자가 있고, 검색할 필드가 정해져 있으면 실행
  if (localSearchQuery.value && props.searchFields.length > 0) {
    // 입력한 글자를 모두 소문자로 바꿔서 저장 (대소문자 구분 안 하게)
    const query = localSearchQuery.value.toLowerCase();

    // result 배열에서 조건에 맞는 데이터만 남기기
    result = result.filter((item) => {
      // props.searchFields 안에 있는 항목들 중 하나라도 일치하면 통과
      // some란 배열에서 주어진 함수를 만족하는 첫 번째 요소를 반환하는 메서드이다.
      return props.searchFields.some((field) => {
        const value = item[field]; // 예: 고객이름, 예약번호
        // 값이 있고, 검색어(query)가 포함되어 있으면 true
        return value && value.toString().toLowerCase().includes(query);
      });
    });
  }

  // ✅ 만약 커스텀 필터 함수(filterFn)가 있으면, 그 함수를 사용해서 필터링
  if (props.filterFn) {
    result = props.filterFn(result, localFilters.value);
  } else {
    // ✅ 커스텀 함수가 없으면 기본 필터 방식으로 작동
    // localFilters에 들어있는 필터를 전부 확인
    // keys() 함수는 객체의 키를 배열로 반환하는 함수이다.
    Object.keys(localFilters.value).forEach((filterKey) => {
      const filterValue = localFilters.value[filterKey];
      // 필터 값이 있고 "all"이나 빈 문자열이 아닐 때만 실행
      if (filterValue && filterValue !== "all" && filterValue !== "") {
        // result에서 해당 필터 조건에 맞는 것만 남기기
        result = result.filter((item) => {
          return (
            // 필드 값이 필터 값과 같거나,
            item[filterKey] === filterValue ||
            // 숫자일 경우엔 필터 값 이상인 것도 허용
            (typeof item[filterKey] === "number" &&
            // parseFloat() 함수는 문자열을 숫자로 변환하는 함수이다.
              item[filterKey] >= parseFloat(filterValue))
          );
        });
      }
    });
  }

  // 다 필터링한 결과를 반환
  return result;
});
// 페이지 네이션된 데이터 계산
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage; // 0
  const end = start + props.itemsPerPage; //5
  // console.log(start, end);
  return filteredData.value.slice(start, end);
});
// 전체 페이지  수 계산
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / props.itemsPerPage);
});
// 셀 렌더링 함수
const renderCell = (item, column) => {
  // console.log(item, column);
  // 커스텀 렌더링 함수가 있으면 사용
  if (column.render && typeof column.render === "function") {
    return column.render(item);
  }
  // 기본값 : 필드값 그대로 표시
  const value = item[column.key];
  // console.log(value);
  return value !== undefined && value !== null ? value : "";
};
// 페이지 이동 함수
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
// 다음페이지
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
// 이전페이지
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
// 데이터 변경시
watch(() => props.data,
()=>{
  currentPage.value = 1
},
{ deep: true });
</script>
