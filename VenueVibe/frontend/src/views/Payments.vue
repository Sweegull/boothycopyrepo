<template>
  <div class="img-container">
    <div class="payment-page">
      <div class="container section-title" data-aos="fade-up">
        <h2>
          <div class="title-with-lines heading-montserrat">
            Payments
          </div>
        </h2>
      </div>

      <div class="payment-container">
        <div class="payment-summary glass-effect">
          <h3 class="summary-title">Payment Summary</h3>
          <div class="summary-details" v-if="boothDetails">
            <div class="summary-item">
              <span>Booth Name:</span>
              <span>{{ boothDetails.booth_title }}</span>
            </div>
            <div class="summary-item">
              <span>Event:</span>
              <span>{{ boothDetails.event_id }}</span>
            </div>
            <div class="summary-item">
              <span>Duration:</span>
              <span>{{ boothDetails.duration }} Hours/Day</span>
            </div>
            <div class="summary-item">
              <span>Size:</span>
              <span>{{ boothDetails.size }} slots</span>
            </div>
            <div class="summary-item">
              <span>Date Range:</span>
              <span>{{ formatDate(boothDetails.date_from) }} - {{ formatDate(boothDetails.date_to) }}</span>
            </div>
            <div class="summary-item total">
              <span>Total Amount:</span>
              <span>${{ boothDetails?.price.toFixed(2) }}</span>
            </div>
          </div>
          <div v-else class="summary-loading">
            <p>Loading booth details...</p>
          </div>
        </div>

        <div class="payment-section ">
          <StripePayment 
            @token-created="handleToken" 
            :amount="boothDetails?.price || 0"
            :disabled="!boothDetails"
          />
        </div>

        <div class="history-section glass-effect">
          <div class="container section-title2" data-aos="fade-up">
            <h2>
              <div class="title-with-lines heading-montserrat">
                Transaction History
              </div>
            </h2>
          </div>

          <div class="transaction-list">
            <div class="filter-section">
              <select v-model="filterStatus" class="filter-select">
                <option value="all">All Transactions</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div class="table-container">
              <table class="transaction-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Booth</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Event</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="transaction in filteredTransactions" 
                      :key="transaction.id"
                      :class="{'status-completed': transaction.status === 'completed',
                              'status-pending': transaction.status === 'pending',
                              'status-failed': transaction.status === 'failed'}">
                    <td>{{ formatDate(transaction.date) }}</td>
                    <td>{{ transaction.boothTitle }}</td>
                    <td>${{ transaction.amount.toFixed(2) }}</td>
                    <td>
                      <span class="status-badge" :class="transaction.status">
                        {{ transaction.status }}
                      </span>
                    </td>
                    <td>{{ transaction.eventId }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-if="filteredTransactions.length === 0" class="empty-state">
              <p>No transactions found</p>
            </div>

            <div class="pagination">
              <button 
                :disabled="currentPage === 1"
                @click="currentPage--"
                class="pagination-button"
              >
                Previous
              </button>
              <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
              <button 
                :disabled="currentPage === totalPages"
                @click="currentPage++"
                class="pagination-button"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Display notification if present -->
      <Notification
        v-if="notification"
        :type="notification.type"
        :title="notification.title"
        :message="notification.message"
      />
    </div>
  </div>
</template>

<script>
import StripePayment from '@/components/StripePayment.vue'
import Notification from '@/components/Notification.vue'
import { boothAPI } from '../services/api'
import { getAuth } from 'firebase/auth'
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'
import dayjs from 'dayjs'

export default {
  name: 'PaymentPage',
  components: {
    StripePayment,
    Notification
  },
  data() {
    return {
      boothDetails: null,
      transactions: [],
      notification: null, // To handle notifications
      filterStatus: 'all',
      currentPage: 1,
      itemsPerPage: 5,
      loading: true,
      error: null,
      userId: null
    }
  },
  async created() {
    const boothId = this.$route.params.boothId
    if (boothId) {
      try {
        const response = await boothAPI.get(`/booths/${boothId}`)
        this.boothDetails = response.data
      } catch (error) {
        console.error('Error fetching booth details:', error)
        this.error = 'Failed to load booth details'
      }
    }
    
    const auth = getAuth()
    if (auth.currentUser) {
      this.userId = auth.currentUser.uid
      await this.fetchUserTransactions()
    }
  },
  computed: {
    filteredTransactions() {
      let filtered = this.transactions
      if (this.filterStatus !== 'all') {
        filtered = this.transactions.filter(t => t.status === this.filterStatus)
      }
      
      filtered = [...filtered].sort((a, b) => b.date - a.date)
      
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return filtered.slice(start, end)
    },
    totalPages() {
      const filtered = this.filterStatus === 'all' 
        ? this.transactions 
        : this.transactions.filter(t => t.status === this.filterStatus)
      return Math.ceil(filtered.length / this.itemsPerPage)
    }
  },
  methods: {
    async handleToken(token) {
      if (!this.boothDetails) {
        this.showNotification('error', 'No booth details available', 'Please try again.')
        return
      }

      try {
        console.log('Payment token received:', token)
        const newTransaction = {
          userId: this.userId,
          boothId: this.boothDetails.booth_id,
          eventId: this.boothDetails.event_id,
          date: new Date(),
          amount: this.boothDetails.price,
          boothTitle: this.boothDetails.booth_title,
          status: 'pending',
          stripeToken: token.id,
          createdAt: serverTimestamp()
        }
        
        const docRef = await addDoc(collection(db, 'transactions'), newTransaction)
        this.transactions.unshift(newTransaction)

        this.showNotification('success', 'Payment Processing', 'Your payment is being processed')

        setTimeout(async () => {
          await this.updateTransactionStatus(docRef.id, 'completed')
          const transactionIndex = this.transactions.findIndex(t => t.id === docRef.id)
          if (transactionIndex !== -1) {
            this.transactions[transactionIndex].status = 'completed'
            this.showNotification('success', 'Payment Successful', 'Your booth has been reserved')
          }
        }, 2000)

      } catch (error) {
        console.error('Payment processing error:', error)
        
        this.showNotification('error', 'Payment Failed', error.message || 'Payment processing failed')
      }
    },
    async updateTransactionStatus(transactionId, status) {
      await updateDoc(doc(db, 'transactions', transactionId), {
        status,
        updatedAt: serverTimestamp()
      })
    },
    async fetchUserTransactions() {
      try {
        const q = query(
          collection(db, 'transactions'),
          where('userId', '==', this.userId)
        )
        const querySnapshot = await getDocs(q)
        this.transactions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate() // Convert Firestore Timestamp to Date
        }))
      } catch (error) {
        console.error('Error fetching transactions:', error)
        this.error = 'Failed to load transaction history'
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      return dayjs(date).format('DD MMM YYYY')
    },
    showNotification(type, title, message) {
      this.notification = { type, title, message }
      setTimeout(() => {
        this.notification = null
      }, 3000) // Auto-hide after 3 seconds
    }
  },
}
</script>

<style scoped>
.payment-page {
  padding: 20px;
}

.payment-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom:0px;
}

.payment-summary, .payment-section, .history-section {
  flex: 1 1 calc(33% - 10px);
  margin: 0px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.total {
  font-weight: bold;
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
}

.transaction-table th, .transaction-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
}

.status-completed {
  background-color: white;
}

.status-pending {
  background-color: white;
}

.status-failed {
  background-color: white;
}

.img-container {
  background-image: url('@/images/img12.jpg');
  background-size: cover;
  min-height: 100vh;
}

.payment-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.payment-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.section-title {
  text-align: center;
  padding: 30px 0;
  position: relative;
}

.section-title2 {
  text-align: center;
  padding: 30px 0;
  position: relative;
}

.section-title h2 {
  font-size: 50px;
  font-weight: 700;
  color: white;
}

.title-with-lines {
  position: relative;
  display: inline-block;
  padding: 0 20px;
}

.title-with-lines::before,
.title-with-lines::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 60px;
  height: 2px;
  background-color: #36b598;
}

.title-with-lines::before {
  right: 100%;
}

.title-with-lines::after {
  left: 100%;
}

.payment-summary {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 1.5rem;
  
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.summary-title {
  color: #32325d;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #36b598;
}

.summary-details {
  margin-top: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.summary-item span:first-child {
  color: #666;
  font-weight: 500;
}

.summary-item span:last-child {
  color: #32325d;
  font-weight: 600;
}

.summary-item.total {
  font-weight: bold;
  font-size: 1.2em;
  border-top: 2px solid #eee;
  border-bottom: none;
  padding-top: 1rem;
  margin-top: 1rem;
  color: #36b598;
}

.history-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-section {
  margin-bottom: 1rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  width: 200px;
  background-color: white;
  color: #32325d;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #36b598;
  box-shadow: 0 0 0 2px rgba(54, 181, 152, 0.2);
}

.table-container {
  overflow-x: auto;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.transaction-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.transaction-table th,
.transaction-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e6e6e6;
}

.transaction-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
  white-space: nowrap;
}

.transaction-table tr:hover {
  background-color: #f8f9fa;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
  text-transform: capitalize;
}

.status-badge.completed {
  background-color: #dcf5dc;
  color: #0a5d0a;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.failed {
  background-color: #f8d7da;
  color: #721c24;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 1.1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem 0;
}

.pagination-button {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #495057;
  font-weight: 500;
}

.pagination-button:hover:not(:disabled) {
  background-color: #36b598;
  border-color: #36b598;
  color: white;
}

.pagination-button:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.7;
}

.page-info {
  color: #6c757d;
  font-size: 0.95rem;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
  .payment-page {
    padding: 1rem;
  }
  
  .section-title h2 {
    font-size: 36px;
  }
  
  .transaction-table {
    font-size: 0.875rem;
  }
  
  .status-badge {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
  
  .title-with-lines::before,
  .title-with-lines::after {
    width: 30px;
  }
  
  .filter-select {
    width: 100%;
  }

  .pagination {
    flex-direction: column;
    gap: 0.5rem;
  }

  .pagination-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .summary-item {
    flex-direction: column;
    gap: 0.5rem;
  }

  .transaction-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>