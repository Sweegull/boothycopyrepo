<script>
import { ref, computed, onMounted } from "vue";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  name: "EventApplications",
  setup() {
    const router = useRouter();
    const applications = ref([]);
    const loading = ref(false);
    const selectedApplication = ref(null);
    const notification = ref(null);
    const auth = getAuth();

    const sortedApplications = computed(() => {
      return [...applications.value].sort((a, b) => {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
    });

    const getBadgeClass = (status) => {
      const baseClass = "badge ";
      switch (status.toLowerCase()) {
        case "pending":
          return baseClass + "bg-warning text-dark";
        case "approved":
          return baseClass + "bg-success";
        case "rejected":
          return baseClass + "bg-danger";
        default:
          return baseClass + "bg-secondary";
      }
    };

    const showNotification = (message, type = "success") => {
      notification.value = { message, type };
      setTimeout(() => {
        notification.value = null;
      }, 3000);
    };

    const fetchApplications = async () => {
      loading.value = true;
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("No user found");
          router.push("/login");
          return;
        }

        const q = query(
          collection(db, "eventApplications"),
          where("userId", "==", user.uid),
          orderBy("updatedAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        applications.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          date: doc.data().date?.toDate(),
        }));
      } catch (error) {
        console.error("Error fetching applications:", error);
        showNotification("Failed to load applications", "error");
      } finally {
        loading.value = false;
      }
    };

    const withdrawApplication = async (application) => {
      if (!["DRAFT", "PENDING"].includes(application.status?.toUpperCase())) {
        showNotification(
          "Only draft or pending applications can be withdrawn",
          "error"
        );
        return;
      }

      if (confirm("Are you sure you want to withdraw this application?")) {
        loading.value = true;
        try {
          await deleteDoc(doc(db, "eventApplications", application.id));
          showNotification("Application successfully withdrawn");
          await fetchApplications();
        } catch (error) {
          console.error("Error withdrawing application:", error);
          showNotification("Failed to withdraw application", "error");
        } finally {
          loading.value = false;
        }
      }
    };

    const formatDate = (date) => {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const isWithdrawable = (application) => {
      return ["DRAFT", "PENDING"].includes(application.status?.toUpperCase());
    };

    const viewBoothDetails = (boothId) => {
      if (boothId) {
        router.push(`/booths/${boothId}`);
      } else {
        showNotification("Booth details not available", "error");
      }
    };

    const viewApplication = (application) => {
      selectedApplication.value = application;
    };

    const createNewApplication = () => {
      router.push("/booths");
    };

    const payForBooth = (application) => {
      if (application.status.toLowerCase() === 'approved') {
        router.push(`/payments/${application.boothId}`);  // assuming boothId exists in the application data
      } else {
        showNotification("Event is not approved yet", "error");
      }
    };

    const closeModal = () => {
      selectedApplication.value = null;
    };

    onMounted(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          await fetchApplications();
        } else {
          router.push("/login");
        }
      });

      return () => unsubscribe();
    });

    return {
      applications,
      sortedApplications,
      loading,
      selectedApplication,
      notification,
      formatDate,
      viewApplication,
      createNewApplication,
      closeModal,
      isWithdrawable,
      getBadgeClass,
      withdrawApplication,
      viewBoothDetails,
      payForBooth,  // method to handle payment redirection
    };
  },
};
</script>

<template>
  <div class="image-container">
    <div class="container section-title" data-aos="fade-up" style="margin-bottom:0px; padding-bottom:0px">
      <h2>
        <div class="title-with-lines heading-montserrat">
          Event Applications 
        </div>
      </h2>
    </div>

    <div class="container py-4">
      <div
        v-if="loading"
        class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
        style="z-index: 1000"
      >
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <button
              @click="createNewApplication"
              class="btn green-btn"
              :disabled="loading"
            >
              + View Available Booths
            </button>
          </div>

          <div
            v-if="applications.length === 0 && !loading"
            class="text-center py-5 text-muted"
          >
            <p class="mb-0">
              No applications found. Start by applying for an event!
            </p>
          </div>

          <div v-else class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="application in sortedApplications"
                  :key="application.id"
                >
                  <td>{{ application.eventName }}</td>
                  <td>{{ formatDate(application.date) }}</td>
                  <td>
                    <span :class="getBadgeClass(application.status)">
                      {{ application.status }}
                    </span>
                  </td>
                  <td>{{ formatDate(application.updatedAt) }}</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button
                        @click="viewApplication(application)"
                        class="btn btn-primary"
                        :disabled="loading"
                      >
                        View
                      </button>

                      <button
                        v-if="isWithdrawable(application)"
                        @click="withdrawApplication(application)"
                        class="btn btn-outline-danger"
                        :disabled="loading"
                      >
                        Withdraw
                      </button>

                      <button
                        v-if="application.status.toLowerCase() === 'approved'"
                        @click="payForBooth(application)"
                        class="btn btn-success"
                        :disabled="loading"
                      >
                        Pay
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        v-if="selectedApplication"
        class="modal fade show d-block"
        style="background-color: rgba(0, 0, 0, 0.5)"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ selectedApplication.eventName }}</h5>
              <button
                type="button"
                class="btn-close"
                @click="closeModal"
              ></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <strong class="text-muted">Status:</strong>
                <span
                  :class="getBadgeClass(selectedApplication.status)"
                  class="ms-2"
                >
                  {{ selectedApplication.status }}
                </span>
              </div>
              <div class="mb-3">
                <strong class="text-muted">Date:</strong>
                <span class="ms-2">{{
                  formatDate(selectedApplication.date)
                }}</span>
              </div>
              <div class="mb-3">
                <strong class="text-muted">Submitted:</strong>
                <span class="ms-2">{{
                  formatDate(selectedApplication.createdAt)
                }}</span>
              </div>
              <div class="mb-3">
                <strong class="text-muted">Last Updated:</strong>
                <span class="ms-2">{{
                  formatDate(selectedApplication.updatedAt)
                }}</span>
              </div>
              <div v-if="selectedApplication.profileDetails">
                <strong class="text-muted">Profile:</strong>
                <div class="mt-2 ps-3">
                  <p class="mb-1">
                    <strong>Name:</strong>
                    {{ selectedApplication.profileDetails.name }}
                  </p>
                  <p class="mb-1">
                    <strong>Focus:</strong>
                    {{ selectedApplication.profileDetails.focus }}
                  </p>
                  <p class="mb-1">
                    <strong>Description:</strong>
                    {{ selectedApplication.profileDetails.description }}
                  </p>
                </div>
              </div>
              <div>
                <strong class="text-muted">Notes:</strong>
                <p class="mb-0 mt-1">
                  {{ selectedApplication.notes || "No notes available" }}
                </p>
              </div>
            </div>
            <div class="modal-footer">
              <button
                @click="viewBoothDetails(selectedApplication.boothId)"
                class="btn btn-info"
                :disabled="loading"
              >
                View Booth Details
              </button>
              <button
                v-if="isWithdrawable(selectedApplication)"
                @click="withdrawApplication(selectedApplication)"
                class="btn btn-outline-danger"
                :disabled="loading"
              >
                Withdraw
              </button>
              <button @click="closeModal" class="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="notification"
        class="position-fixed bottom-0 end-0 p-3"
        style="z-index: 1100"
      >
        <div
          :class="[
            'toast show',
            {
              'bg-success': notification.type === 'success',
              'bg-danger': notification.type === 'error',
            },
          ]"
          role="alert"
        >
          <div class="toast-body text-white">
            {{ notification.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style src="@/styles/review.css" scoped />
<style scoped>
@media (max-width: 768px) {
  
   .section-title h2 {
    font-size: 36px;
  }
}


.image-container {
  background-image: url("@/images/img7.jpg");
  background-size: cover;
}


.green-btn {
  background-color: #36b598;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.green-btn:hover {
  background-color: #2d9a82;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #36b598 !important;
  border-color: #36b598 !important;
  color: white !important;
}

.btn-primary:hover {
  background-color: #2d9a82 !important;
  border-color: #2d9a82 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-info {
  background-color: #36b598 !important;
  border-color: #36b598 !important;
  color: white !important;
}

.btn-info:hover {
  background-color: #2d9a82 !important;
  border-color: #2d9a82 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-outline-danger {
  color: #dc3545 !important;
  border-color: #dc3545 !important;
  background-color: transparent !important;
}

.btn-outline-danger:hover {
  color: white !important;
  background-color: #dc3545 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
  border: none;
}

.btn-secondary:hover {
  background-color: #d0d0d0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  opacity: 0.65;
  transform: none !important;
  box-shadow: none !important;
  cursor: not-allowed;
}

.table {
  margin-top: 20px;
}

.table td {
  vertical-align: middle;
}

.badge {
  padding: 0.5em 0.75em;
}

.bg-warning {
  background-color: #36b598 !important;
  color: white !important;
}

.btn-group .btn {
  margin: 0 2px;
}

.modal-dialog {
  max-width: 600px;
}

.modal-content {
  border-radius: 8px;
}

.modal-header {
  border-bottom: 1px solid #eee;
}

.modal-footer {
  border-top: 1px solid #eee;
}

.toast {
  border-radius: 8px;
}

.toast.bg-success {
  background-color: #36b598 !important;
}

.toast.bg-danger {
  background-color: #dc3545 !important;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@media screen and (max-width: 768px) {
  .btn-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .btn-group .btn {
    width: 100%;
    margin: 0;
  }

  .modal-dialog {
    margin: 10px;
  }

  .table td {
    white-space: nowrap;
  }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Hide Date, Status, and Last Updated columns on smaller screens */
@media screen and (max-width: 768px) {
  /* Hide the columns by targeting the th and td for Date, Status, and Last Updated */
  .table th:nth-child(2),
  .table th:nth-child(3),
  .table th:nth-child(4),
  .table td:nth-child(2),
  .table td:nth-child(3),
  .table td:nth-child(4) {
    display: none;
  }
}

</style>
