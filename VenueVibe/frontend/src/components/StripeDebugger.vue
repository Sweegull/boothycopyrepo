<template>
    <div class="debug-container">
      <div class="debug-card">
        <h3 class="debug-title">Stripe Integration Debug</h3>
        
        <div class="status-item" :class="{ 'status-success': stripeKey, 'status-error': !stripeKey }">
          <span class="status-label">Stripe Key:</span>
          <span class="status-value">
            {{ stripeKey ? '✓ Present' : '✗ Missing' }}
          </span>
        </div>
  
        <div class="status-item" :class="{ 'status-success': isHttps, 'status-warning': !isHttps }">
          <span class="status-label">HTTPS Status:</span>
          <span class="status-value">
            {{ isHttps ? '✓ HTTPS' : '⚠ HTTP (Stripe requires HTTPS in production)' }}
          </span>
        </div>
  
        <div class="status-item" :class="{ 'status-success': stripeLoaded, 'status-error': !stripeLoaded }">
          <span class="status-label">Stripe Loading:</span>
          <span class="status-value">
            {{ stripeLoadingStatus }}
          </span>
        </div>
  
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
  
        <div class="debug-info">
          <p class="text-xs">Environment: {{ environment }}</p>
          <p v-if="stripeKey" class="text-xs">Key Preview: {{ maskedStripeKey }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { loadStripe } from '@stripe/stripe-js'
  
  export default {
    name: 'StripeDebugger',
    data() {
      return {
        stripeKey: null,
        isHttps: false,
        stripeLoaded: false,
        error: null,
        isLoading: true
      }
    },
    computed: {
      environment() {
        return process.env.NODE_ENV
      },
      maskedStripeKey() {
        return this.stripeKey ? `${this.stripeKey.slice(0, 8)}...` : 'N/A'
      },
      stripeLoadingStatus() {
        if (this.isLoading) return 'Loading...'
        if (this.stripeLoaded) return '✓ Loaded'
        return '✗ Failed to load'
      }
    },
    async created() {
      try {
        // Check HTTPS
        this.isHttps = window.location.protocol === 'https:'
        
        // Check Stripe key
        this.stripeKey = process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY
        
        if (this.stripeKey) {
          // Try loading Stripe
          const stripe = await loadStripe(this.stripeKey)
          this.stripeLoaded = !!stripe
        }
      } catch (err) {
        this.error = `Debug Error: ${err.message}`
        console.error('Stripe debug error:', err)
      } finally {
        this.isLoading = false
      }
    }
  }
  </script>
  
  <style scoped>
  .debug-container {
    max-width: 500px;
    margin: 1rem auto;
    padding: 0 1rem;
  }
  
  .debug-card {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1rem;
  }
  
  .debug-title {
    font-size: 1rem;
    font-weight: 600;
    color: #495057;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
    background: white;
  }
  
  .status-label {
    font-weight: 500;
    color: #495057;
  }
  
  .status-value {
    font-size: 0.875rem;
  }
  
  .status-success {
    background-color: #d4edda;
    color: #155724;
  }
  
  .status-error {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  .status-warning {
    background-color: #fff3cd;
    color: #856404;
  }
  
  .error-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: #f8d7da;
    color: #721c24;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  
  .debug-info {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #dee2e6;
    color: #6c757d;
  }
  
  .text-xs {
    font-size: 0.75rem;
    margin: 0.25rem 0;
  }
  </style>