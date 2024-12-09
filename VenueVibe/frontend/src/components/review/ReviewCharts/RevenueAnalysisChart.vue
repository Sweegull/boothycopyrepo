# RevenueAnalysisChart.vue
<template>
  <div class="col-md-12 mb-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h2 class="card-title">
          Revenue & Transaction Analysis for {{ eventId }}
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

const { createRevenueAnalysisChart, destroyChart } = useCharts();

// Helper function to get the midpoint of a range
const getRevenueMidpoint = (range) => {
  switch (range) {
    case '0-50': return 25;
    case '50-100': return 75;
    case '100-300': return 200;
    case '300-500': return 400;
    case '500-1000': return 750;
    case '1000+': return 1500;
    default: return 0;
  }
};

// Helper function to get the midpoint of transaction range
const getTransactionMidpoint = (range) => {
  switch (range) {
    case '1-10': return 5;
    case '11-30': return 20;
    case '31-50': return 40;
    case '51-100': return 75;
    case '100+': return 150;
    default: return 0;
  }
};

const updateChart = () => {
  if (chart.value) {
    destroyChart(chart.value);
  }

  if (chartRef.value && props.reviews.length > 0) {
    // Initialize data structure for categories
    const categoryMetrics = {};
    
    // Process all reviews from Firebase
    props.reviews.forEach(review => {
      if (!categoryMetrics[review.category]) {
        categoryMetrics[review.category] = {
          totalRevenue: 0,
          totalTransactions: 0,
          count: 0
        };
      }

      const metrics = categoryMetrics[review.category];
      metrics.count++;
      metrics.totalRevenue += getRevenueMidpoint(review.revenueRange);
      metrics.totalTransactions += getTransactionMidpoint(review.transactionRange);
    });

    // Prepare data for the chart
    const data = {
      labels: Object.keys(categoryMetrics),
      avgRevenue: [],
      avgTransactions: []
    };

    // Calculate averages for each category
    Object.entries(categoryMetrics).forEach(([category, metrics]) => {
      data.avgRevenue.push(Math.round(metrics.totalRevenue / metrics.count));
      data.avgTransactions.push(Math.round(metrics.totalTransactions / metrics.count));
    });

    chart.value = createRevenueAnalysisChart(chartRef.value, data);
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
  height: 400px;
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