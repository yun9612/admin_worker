<template>
  <div class="space-y-6 bg-white text-black dark:bg-black dark:text-white p-4 rounded">
    <h2 class="text-3xl font-bold mb-6">고객 소통 관리</h2>
    <!-- 고객 소통 통계 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div
        v-for="card in statCards"
        :key="card.id"
        :class="[card.backgroundClass, 'rounded-lg shadow-lg p-6 text-white']">
        <div class="flex items-center justify-between">
          <!-- 카드 속 글자 -->
          <div>
            <p :class="[card.labelClass, 'text-sm mb-1']">{{ card.label }}</p>
            <p class="text-3xl font-bold">
              {{}}
              <span v-if="card.suffix">{{ card.suffix }}</span>
            </p>
          </div>
          <!-- 카드 속 아이콘 -->
          <div
            class="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i :class="[card.iconClass, 'text-2xl', card.iconColor]"></i>
          </div>
        </div>
      </div>
    </div>
    <!-- 필터링 검색 -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <!-- 검색창 전체 -->
      <div class="flex flex-col md:flex-row gap-4">
        <!-- 왼쪽 버튼들 -->
        <div class="flex flex-wrap gap-2 flex-1">
          <button
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              currentFilter === filter.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
            @click="currentFilter = filter.value"
            v-for="filter in filters"
            :key="filter.value">
            <i :class="[filter.icon, 'mr-2']"></i>
            {{ filter.label }}
          </button>
        </div>
        <!-- 검색창 -->
        <div class="flex gap-2">
          <input
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            v-model="searchQuery"
            type="text"
            @input="handleInput"
            placeholder="고객명으로 검색" />
        </div>
      </div>
    </div>
    <!-- 대화 목록 -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                대화 시작일
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                고객명
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                마지막 메시지
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                응답 시간
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                만족도
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              class="hover:bg-gray-50 transition-colors"
              v-for="conversation in filteredConversations"
              :key="conversation.id">
              <!-- 대화 시작일 -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(conversation.startDate) }}
              </td>
              <!-- 고객명 -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <p
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold',
                      getCustomerAvatarBg(conversation.customerName),
                    ]">
                    {{ conversation.customerName[0] }}
                  </p>
                  <span class="ml-3 text-sm text-gray-900">{{ conversation.customerName }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                <div class="flex items-center">
                  <span>{{ conversation.lastMessage }}</span>
                  <span
                    v-if="conversation.unreadCount > 0"
                    class="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {{ conversation.unreadCount }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    conversation.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : conversation.status === 'waiting'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800',
                  ]">
                  {{ getStatusText(conversation.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ conversation.responseTime }}분
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex">
                    <i
                      v-for="i in 5"
                      :key="i"
                      :class="[
                        'fas fa-star text-xs',
                        i <= conversation.rating ? 'text-yellow-400' : 'text-gray-300',
                      ]"></i>
                  </div>
                  <span class="ml-2 text-xs text-gray-600" v-if="conversation.rating">
                    ({{ conversation.rating }})
                  </span>
                  <span class="ml-2 text-xs text-gray-400" v-else>미평가</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  class="text-indigo-600 hover:text-indigo-900"
                  @click="openConversation(conversation)">
                  <i class="fas fa-comment-dots mr-1"></i>
                  대화보기
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 대화 상세 모달 -->
    <!-- 모달 배경 -->
    <div
      v-if="selectedConversation"
      class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <!-- 모달창 -->
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div class="p-6 border-b flex justify-between items-center">
          <!-- 사용자 정보 -->
          <div class="flex items-center">
            <!-- 이름 첫글자 아이콘 -->
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold',
                getCustomerAvatarBg(selectedConversation.customerName),
              ]">
              {{ selectedConversation.customerName[0] }}
            </div>
            <!-- 이름 이메일 -->
            <div class="ml-4">
              <h3 class="text-xl font-bold">{{ selectedConversation.customerName }}</h3>
              <p class="text-sm text-gray-500">{{ selectedConversation.email }}</p>
            </div>
          </div>
          <!-- 닫기 버튼 -->
          <button
            class="text-gray-400 hover:text-gray-600 cursor-pointer"
            @click="selectedConversation = null">
            <i class="fas fa-times text-2xl"></i>
          </button>
        </div>
        <!-- 대화 내용 -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          <div
            :class="['flex', message.sender === 'customer' ? 'justify-start' : 'justify-end']"
            v-for="message in conversationMessages"
            :key="message.id">
            <!-- 메세지 정렬 및 데이터 확인 -->
            <div
              :class="[
                'max-w-lg',
                message.sender === 'customer' ? 'bg-white' : 'bg-indigo-600 text-white',
                'rounded-lg p-4 shadow-sm',
              ]">
              <div class="text-xs mb-1 opacity-70">
                {{ message.sender === "customer" ? selectedConversation.customerName : "관리자" }}
              </div>
              <div class="text-sm">{{ message.content }}</div>
              <div class="text-xs mt-2 opacity-70">{{ formatDateTime(message.timestamp) }}</div>
            </div>
          </div>
        </div>
        <!-- 대화 입력 및 답변 -->
        <div class="p-6 border-t bg-white">
          <div class="flex flex-col md:flex-row md:items-center gap-3">
            <!-- 대화 입력창 -->
            <input
              type="text"
              v-model="newMessage"
              placeholder="메세지를 입력하세요."
              @keyup.enter="sendMessage"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            <div class="flex flex-wrap gap-2">
              <button
                @click="openQuick"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <i class="fas fa-bolt mr-2"></i>
                빠른 답변
              </button>
              <button
                @click="sendMessage"
                class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <i class="fas fa-paper-plane mr-2"></i>
                전송
              </button>
              <button
                @click="markAnswered"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <i class="fas fa-check-circle mr-2"></i>
                답변 완료
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 빠른 답변 모달 -->
    <div
      v-if="showQuick"
      class="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-2xl font-bold">빠른 답변 템플릿</h3>
            <button class="text-gray-400 hover:text-gray-600" @click="showQuick = false">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              v-for="template in quickTemplates"
              :key="template.id"
              @click="selectTemplate(template)"
              class="p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-left">
              <h4 class="font-semibold mb-2">{{ template.title }}</h4>
              <p class="text-sm text-gray-600">{{ template.content }}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

// 기본값
const currentFilter = ref("all"); // 버튼
const searchQuery = ref(""); // 검색창
const selectedConversation = ref(null);
const newMessage = ref("");
const showQuick = ref(false);

// input의 한글 이슈 해결
function handleInput(event) {
  searchQuery.value = event.target.value;
}

// 통계 카드 더미
const statCards = computed(() => [
  {
    id: "total",
    label: "전체 대화",
    // value: totalConversations.value,
    suffix: "",
    labelClass: "text-blue-100",
    backgroundClass: "bg-gradient-to-br from-blue-500 to-blue-600",
    iconClass: "fas fa-comments",
    iconColor: "text-blue-500",
  },
  {
    id: "active",
    label: "활성 대화",
    // value: activeConversations.value,
    suffix: "",
    labelClass: "text-green-100",
    backgroundClass: "bg-gradient-to-br from-green-500 to-green-600",
    iconClass: "fas fa-comment-dots",
    iconColor: "text-green-500",
  },
  {
    id: "avg-response",
    label: "평균 응답 시간",
    // value: avgResponseTime.value,
    suffix: "m",
    labelClass: "text-yellow-100",
    backgroundClass: "bg-gradient-to-br from-yellow-500 to-yellow-600",
    iconClass: "fas fa-clock",
    iconColor: "text-yellow-600",
  },
  {
    id: "satisfaction",
    label: "만족도",
    // value: satisfactionRate.value,
    suffix: "%",
    labelClass: "text-purple-100",
    backgroundClass: "bg-linear-to-br from-purple-500 to-purple-600",
    iconClass: "fas fa-star",
    iconColor: "text-purple-500",
  },
]);

// 검색 버튼 더미
const filters = [
  { label: "전체", value: "all", icon: "fas fa-list" },
  { label: "활성", value: "active", icon: "fas fa-comment-dots" },
  { label: "대기중", value: "waiting", icon: "fas fa-clock" },
  { label: "완료", value: "closed", icon: "fas fa-check-circle" },
];

// 목록 샘플 더미
const conversations = ref([
  {
    id: 1,
    customerName: "김철수",
    email: "kim@example.com",
    startDate: new Date("2025-11-10"),
    lastMessage: "감사합니다. 다음에도 이용하겠습니다!",
    status: "closed",
    responseTime: 15,
    rating: 5,
    unreadCount: 0,
  },
  {
    id: 2,
    customerName: "이영희",
    email: "lee@example.com",
    startDate: new Date("2025-11-09"),
    lastMessage: "청소 후 확인을 받아볼 수 있나요?",
    status: "active",
    responseTime: 8,
    rating: 4,
    unreadCount: 1,
  },
  {
    id: 3,
    customerName: "박민수",
    email: "park@example.com",
    startDate: new Date("2025-11-12"),
    lastMessage: "혹시 시간 변경이 가능한가요?",
    status: "waiting",
    responseTime: null,
    rating: null,
    unreadCount: 1,
  },
]);

// 샘플 메시지 데이터
const allMessages = ref([
  {
    id: 1,
    conversationId: 1,
    sender: "customer",
    content: "청소 잘 해주셔서 감사합니다!",
    timestamp: new Date("2025-11-11T10:30:00"),
  },
  {
    id: 2,
    conversationId: 1,
    sender: "admin",
    content: "감사합니다! 다음에도 이용해주세요.",
    timestamp: new Date("2025-11-10T10:45:00"),
  },
  {
    id: 3,
    conversationId: 2,
    sender: "customer",
    content: "청소는 언제 시작되나요?",
    timestamp: new Date("2025-11-10T09:00:00"),
  },
  {
    id: 4,
    conversationId: 2,
    sender: "admin",
    content: "예약하신 시간인 오후 2시에 시작됩니다.",
    timestamp: new Date("2025-11-10T09:15:00"),
  },
  {
    id: 5,
    conversationId: 2,
    sender: "customer",
    content: "청소 후 확인을 받아볼 수 있나요?",
    timestamp: new Date("2025-11-12T14:30:00"),
  },
  {
    id: 6,
    conversationId: 3,
    sender: "customer",
    content: "혹시 시간 변경이 가능한가요?",
    timestamp: new Date("2025-11-11T08:00:00"),
  },
]);

// 빠른 답변 템플릿
const quickTemplates = ref([
  {
    id: 1,
    title: "안녕하세요",
    content: "안녕하세요. 고객님의 문의에 답변드리겠습니다.",
  },
  {
    id: 2,
    title: "예약 확인",
    content: "예약이 정상적으로 접수되었습니다. 담당 기사가 연락드리겠습니다.",
  },
  {
    id: 3,
    title: "감사 인사",
    content: "이용해 주셔서 감사합니다. 만족스러운 서비스 제공을 위해 노력하겠습니다.",
  },
  {
    id: 4,
    title: "대기 요청",
    content: "잠시만 기다려 주세요. 담당자가 확인 중입니다.",
  },
]);

// 새로운 메세지를 전송하였을 때 id값을 증가시키기 위함
const messageIdCounter = ref(
  allMessages.value.length ? Math.max(...allMessages.value.map((m) => m.id)) + 1 : 1
);

// 목록 샘플 데이터 필터링
const filteredConversations = computed(() => {
  // 버튼으로 필터링
  let result = conversations.value;
  if (currentFilter.value !== "all") {
    result = result.filter((c) => c.status === currentFilter.value);
  }

  // input에 입력한 값 필터링
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((c) => c.customerName.toLowerCase().includes(query));
  }

  // 목록 오름차순 b-a 정렬하는 코드 -작은수부터 / 내림차순 a-b -큰수부터
  return result.sort((a, b) => b.startDate - a.startDate);
});

// 날짜 포멧
function formatDate(date) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// 시간 포맷
function formatDateTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 이름 앞 아이콘
function getCustomerAvatarBg(name) {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  // charCodeAt() - 문자열의 첫번째 문자의 유니코드 값 반환 메서드
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

// 상태 문구
function getStatusText(status) {
  const statusMap = {
    active: "진행중",
    waiting: "대기중",
    closed: "답변완료",
  };
  return statusMap[status];
}

// 대화보기 버튼 클릭 시 모달 오픈
function openConversation(conversation) {
  // console.log(conversation); 해당 더미가 들어오는지 확인
  selectedConversation.value = conversation;
}

// 대화 내용
const conversationMessages = computed(() => {
  if (!selectedConversation.value) return []; // 선택된 대화가 없으면 빈 배열 반환
  return allMessages.value
    .filter((m) => m.conversationId === selectedConversation.value.id)
    .sort((a, b) => a.timestamp - b.timestamp);
});

// 메세지 전송
function sendMessage() {
  if (!newMessage.value.trim() || !selectedConversation.value) return;
  // 입력값이 더미로 생성됨
  const message = {
    id: messageIdCounter.value++,
    // 선택된 conversation더미의 id라서
    conversationId: selectedConversation.value.id,
    sender: "admin",
    content: newMessage.value,
    timestamp: new Date(),
  };
  // allMessages 더미에 추가
  allMessages.value.push(message);
  // 마지막 메세지 변경
  selectedConversation.value.lastMessage = message.content;
  newMessage.value = "";
}

// 답변 완료
function markAnswered() {
  if (!selectedConversation.value) return;
  // 클릭된 답변완료의 대화의 인덱스 번호를 가져와서
  const idx = conversations.value.findIndex((c) => c.id === selectedConversation.value.id);
  // 불가능한 인덱스 번호가 아니면 = 모든 인덱스 번호의 답변 완료 버튼
  if (idx !== -1) {
    // 상태가 답변완료로 바뀜
    conversations.value[idx].status = "closed";
    // 읽지않은 메세지 갯수 0으로
    conversations.value[idx].unreadCount = 0;
    // 모달창 닫기
    selectedConversation.value = null;
  }
}

// 빠른 답변
function openQuick() {
  if (!selectedConversation.value) {
    alert("먼저 대화를 선택해주세요.");
    return;
  }
  showQuick.value = true;
}

// 빠른 답변 선택 시
function selectTemplate(template) {
  if (selectedConversation.value) {
    newMessage.value = template.content;
    showQuick.value = false;
    document.querySelector('input[v-model="newMessage"]')?.focus();
  }
}

</script>
