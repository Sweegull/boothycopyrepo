<template>
  <div class="payment-container">
    <div class="payment-form">
      <h2 class="payment-title">Payment Details</h2>
      
      <div class="amount-display">
        <div class="amount-label">Amount to Pay:</div>
        <div class="amount-value">${{ amount.toFixed(2) }}</div>
      </div>
      
      <div class="payment-method-section">
        <h3 class="section-subtitle">Payment Method</h3>
        <div class="payment-methods">
          <div class="payment-method-item selected">
            <div><i class="fas fa-credit-card"></i></div>
            <div><span>Credit / Debit Card</span></div>
          </div>
        </div>
      </div>
      
      <div class="card-section">
        <h3 class="section-subtitle">Card Information</h3>
        <div class="stripe-card-container">
          <div ref="cardElement" class="card-element"></div>
        </div>
      </div>

      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ error }}
      </div>

      <div v-if="isProcessing" class="processing-indicator">
        <div class="spinner"></div>
        <span>Processing your payment...</span>
      </div>

      <button 
        class="payment-button"
        @click="handleSubmit"
        :disabled="!isReady || isProcessing || disabled"
      >
        <i class="fas fa-lock"></i>
        {{ isProcessing ? 'Processing...' : 'Pay Securely Now' }}
      </button>

      <div class="secure-notice">
        <i class="fas fa-shield-alt"></i>
        <span>Your payment information is secure and encrypted</span>
      </div>

      <div class="accepted-cards">
        <span>We accept:</span>
        <div class="card-icons">
          <i class="fab fa-cc-visa"></i>
          <i class="fab fa-cc-mastercard"></i>
          <i class="fab fa-cc-amex"></i>
          <i class="fab fa-cc-discover"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadStripe } from '@stripe/stripe-js'

export default {
  name: 'StripePayment',
  
  props: {
    amount: {
      type: Number,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      stripe: null,
      card: null,
      error: null,
      isProcessing: false,
      isReady: false
    }
  },

  async mounted() {
    try {
      const stripeKey = process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY
      this.stripe = await loadStripe(stripeKey)

      const elements = this.stripe.elements()
      this.card = elements.create('card', {
        style: {
          base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#aab7c4'
            },
            ':-webkit-autofill': {
              color: '#32325d',
            },
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
            '::placeholder': {
              color: '#FFCDD2'
            }
          }
        },
        hidePostalCode: true 
      })

      this.card.mount(this.$refs.cardElement)

      this.card.on('change', (event) => {
        this.error = event.error ? event.error.message : ''
        this.isReady = event.complete
        
        this.$emit('validation-change', {
          isValid: event.complete,
          error: this.error
        })
      })

    } catch (err) {
      console.error('Stripe setup error:', err)
      this.error = 'Failed to load payment system'
      this.$emit('setup-error', err)
    }
  },

  methods: {
    async handleSubmit() {
      if (!this.stripe || !this.card) {
        this.error = 'Payment system is not initialized'
        return
      }

      if (this.disabled) {
        this.error = 'Payment is currently disabled'
        return
      }

      try {
        this.isProcessing = true
        this.error = null

        const { token, error } = await this.stripe.createToken(this.card, {
          amount: this.amount * 100, // Convert to cents for Stripe
          currency: 'usd'
        })

        if (error) {
          throw error
        }

        this.$emit('token-created', token)
        
        this.card.clear()
        this.isReady = false

      } catch (err) {
        this.error = err.message || 'Payment processing failed'
        this.$emit('payment-error', err)
      } finally {
        this.isProcessing = false
      }
    },

    clearForm() {
      if (this.card) {
        this.card.clear()
        this.error = null
        this.isReady = false
      }
    }
  },

  beforeUnmount() {
    if (this.card) {
      this.card.unmount()
    }
  }
}
</script>

<style scoped>
.payment-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
}

.payment-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.payment-title {
  color: #32325d;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
}

.amount-display {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(54, 181, 152, 0.1);
  border-radius: 8px;
}

.amount-label {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.amount-value {
  font-size: 2rem;
  font-weight: 700;
  color: #36b598;
}

.payment-method-section {
  margin-bottom: 2rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #32325d;
  margin-bottom: 1rem;
  font-weight: 500;
}

.payment-methods {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.payment-method-item {
  flex: 1;
  padding: 1rem;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method-item.selected {
  border-color: #36b598;
  background: rgba(54, 181, 152, 0.1);
}

.payment-method-item i {
  font-size: 1.5rem;
  color: #36b598;
  margin-bottom: 0.5rem;
}

.stripe-card-container {
  margin-bottom: 1.5rem;
}

.card-element {
  padding: 1rem;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: white;
  transition: border-color 0.3s ease;
}

.card-element:hover {
  border-color: #36b598;
}

.error-message {
  color: #fa755a;
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: #fff8f6;
  border-radius: 4px;
  text-align: center;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.processing-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;
  color: #36b598;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(54, 181, 152, 0.3);
  border-radius: 50%;
  border-top-color: #36b598;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.payment-button {
  width: 100%;
  padding: 1rem;
  background: #36b598;
  color: white;
  border: 0;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.payment-button:hover:not(:disabled) {
  background: #2d9a82;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(54, 181, 152, 0.3);
}

.payment-button:disabled {
  background: #a3acca;
  cursor: not-allowed;
  transform: none;
}

.payment-button i {
  font-size: 1.2rem;
}

.secure-notice {
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.secure-notice i {
  color: #36b598;
}

.accepted-cards {
  margin-top: 1.5rem;
  text-align: center;
  color: #666;
}

.card-icons {
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.card-icons i {
  font-size: 2rem;
  color: #32325d;
}

@media (max-width: 480px) {
  .payment-form {
    padding: 1.5rem;
  }

  .amount-value {
    font-size: 1.5rem;
  }

  .payment-button {
    font-size: 1rem;
    padding: 0.875rem;
  }

  .card-icons i {
    font-size: 1.5rem;
  }
}
</style>