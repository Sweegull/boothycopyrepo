# DemographicsChart.vue
<template>
  <div class="col-md-6">
    <div class="card shadow-sm">
      <div class="card-body">
        <h2 class="card-title">
          Category Distribution for {{ eventId }}
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

const { createDemographicsChart, destroyChart } = useCharts();

const updateChart = () => {
  if (chart.value) {
    destroyChart(chart.value);
  }

  if (chartRef.value) {
    // Calculate category distribution
    const categories = {
      "Food & Beverages": 0,
      "Artist, Creator, Crafts": 0,
      "Jewellery & Accessories": 0,
      "Fashion, Apparel & Clothing": 0,
      "Family & Pets": 0,
      "Others": 0
    };

    props.reviews.forEach(review => {
      if (categories.hasOwnProperty(review.category)) {
        categories[review.category]++;
      } else {
        categories["Others"]++;
      }
    });

    const data = {
      labels: Object.keys(categories),
      values: Object.values(categories)
    };

    chart.value = createDemographicsChart(chartRef.value, data);
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