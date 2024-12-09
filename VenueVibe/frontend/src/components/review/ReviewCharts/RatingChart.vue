# RatingChart.vue
<template>
  <div class="col-md-6">
    <div class="card shadow-sm">
      <div class="card-body">
        <h2 class="card-title">
          Rating Distribution for Event {{ eventId }}
        </h2>
        <div class="chart-container">
          <canvas ref="chartRef"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useCharts } from '@/composables/useCharts';

const props = defineProps({
  reviews: {
    type: Array,
    required: true
  },
  eventId: {
    type: String,
    required: true
  }
});

const chartRef = ref(null);
const chart = ref(null);

const { createRatingChart, destroyChart } = useCharts();

const updateChart = () => {
  if (chart.value) {
    destroyChart(chart.value);
  }

  if (chartRef.value) {
    // Calculate rating distribution
    const ratingCounts = [1, 2, 3, 4, 5].map(rating =>
      props.reviews.filter(review => parseInt(review.rating) === rating).length
    );

    chart.value = createRatingChart(chartRef.value, ratingCounts);
  }
};

// Watch for changes in reviews to update chart
watch(() => props.reviews, () => {
  updateChart();
}, { deep: true });

onMounted(() => {
  updateChart();
});

onBeforeUnmount(() => {
  if (chart.value) {
    destroyChart(chart.value);
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #6f6e6e;
  text-align: center;
}
</style>