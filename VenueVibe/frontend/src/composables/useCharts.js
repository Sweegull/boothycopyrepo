// useCharts.js
import Chart from 'chart.js/auto';

export function useCharts() {
  const chartColors = {
    primary: '#36b598',
    secondary: '#2d9b82',
    gradient: [
      '#36b598',
      '#2d9b82',
      '#248169',
      '#1b6751',
      '#124d3a',
      '#093322'
    ]
  };

  const createRatingChart = (canvas, data) => {
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: [
          '1 - Poor',
          '2 - Fair',
          '3 - Good',
          '4 - Very Good',
          '5 - Excellent'
        ],
        datasets: [{
          label: 'Number of Reviews',
          data: data,
          backgroundColor: chartColors.primary,
          borderColor: chartColors.secondary,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                if (Math.floor(value) === value) {
                  return value;
                }
              }
            }
          }
        }
      }
    });
  };

  const createDemographicsChart = (canvas, data) => {
    return new Chart(canvas, {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: chartColors.gradient,
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              boxWidth: 12
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  };

  const createRevenueAnalysisChart = (canvas, data) => {
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: [
          {
            label: 'Average Revenue ($)',
            data: data.avgRevenue,
            backgroundColor: chartColors.primary,
            borderColor: chartColors.secondary,
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Average Transactions',
            data: data.avgTransactions,
            backgroundColor: chartColors.gradient[3],
            borderColor: chartColors.gradient[4],
            borderWidth: 1,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  if (label.includes('Revenue')) {
                    return `${label}: $${context.parsed.y.toLocaleString()}`;
                  }
                  return `${label}: ${Math.round(context.parsed.y)}`;
                }
                return '';
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Average Revenue ($)'
            },
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Average Transactions'
            },
            ticks: {
              stepSize: 1
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  };

  const destroyChart = (chart) => {
    if (chart) {
      chart.destroy();
    }
  };

  return {
    createRatingChart,
    createDemographicsChart,
    createRevenueAnalysisChart,
    destroyChart
  };
}