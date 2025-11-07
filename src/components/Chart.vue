<template>
  <Pie :data="data" />
</template>

<script setup>
// 차트 데이터
const data = {
  labels: ["VueJs", "EmberJs", "ReactJs", "AngularJs"],
  datasets: [
    {
      backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
      data: [40, 20, 80, 10],
    },
  ],
};
// 차트 옵션

</script>
