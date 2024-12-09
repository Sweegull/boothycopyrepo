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
  updateDoc,
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

    // Retrieve all applications where the user's UID matches boothId.split('_')[0]
    const q = query(
      collection(db, "eventApplications"),
      where("boothId", ">=", user.uid), // Get booths with the UID
      orderBy("updatedAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    // Filter applications where boothId starts with the user's UID
    applications.value = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        name: doc.data().profileDetails?.name || "No Name", // Add profile name
      }))
      .filter((application) => {
        const boothId = application.boothId || "";
        const boothOwnerId = boothId.split("_")[0]; // Get the part before '_'
        return boothOwnerId === user.uid; // Only keep applications for this user
      });
  } catch (error) {
    console.error("Error fetching applications:", error);
    showNotification("Failed to load applications", "error");
  } finally {
    loading.value = false;
  }
};

const approveApplication = async (application) => {
      if (application.status?.toUpperCase() === "APPROVED") {
        showNotification("This application is already approved.", "error");
        return;
      }

      if (confirm("Are you sure you want to approve this application?")) {
        loading.value = true;
        try {
          const applicationRef = doc(db, "eventApplications", application.id);
          await updateDoc(applicationRef, { status: "APPROVED" });
          showNotification("Application successfully approved");
          await fetchApplications();
        } catch (error) {
          console.error("Error approving application:", error);
          showNotification("Failed to approve application", "error");
        } finally {
          loading.value = false;
        }
      }
    };


    const rejectApplication = async (application) => {
      if (!["PENDING"].includes(application.status?.toUpperCase())) {
        showNotification(
          "Only pending applications can be rejected",
          "error"
        );
        return;
      }

      if (confirm("Are you sure you want to reject this application?")) {
        loading.value = true;
        try {
          await deleteDoc(doc(db, "eventApplications", application.id));
          showNotification("Application successfully rejected");
          await fetchApplications();
        } catch (error) {
          console.error("Error rejecting application:", error);
          showNotification("Failed to reject application", "error");
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

    const isRejectable = (application) => {
      return ["PENDING"].includes(application.status?.toUpperCase());
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
      isRejectable,
      getBadgeClass,
      rejectApplication,
      viewBoothDetails,
      approveApplication
    };
  },
};
</script>


<template>
  <div class="image-container">
    <div class="container section-title mb-0"  data-aos="fade-up">
      <div>
      <h2 class="title-with-lines heading-montserrat">Event Applications</h2>
    </div>
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
              + Add New Booth
            </button>
          </div>

          <div
            v-if="applications.length === 0 && !loading"
            class="text-center py-5 text-muted"
          >
            <p class="mb-0">
              No applications found.
            </p>
          </div>

          <div v-else class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Profile Name</th> <!-- Changed from Date to Profile Name -->
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="application in sortedApplications" :key="application.id">
                  <td>{{ application.eventName }}</td>
                  <td>{{ application.name }}</td> <!-- Display Profile Name here -->
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
                          <!-- Approve Button -->
                      <button
                        v-if="application.status.toUpperCase() === 'PENDING'"
                        @click="approveApplication(application)"
                        class="btn btn-outline-success"
                        :disabled="loading"
                      >
                        Approve
                      </button>
                      <button
                        v-if="isRejectable(application)"
                        @click="rejectApplication(application)"
                        class="btn btn-outline-danger"
                        :disabled="loading"
                      >
                        Reject
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
                  <p class="mb-3">
                    <strong>Description:</strong>
                    {{ selectedApplication.profileDetails.description }}
                  </p>
                </div>
              </div>
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
                v-if="isRejectable(selectedApplication)"
                @click="rejectApplication(selectedApplication)"
                class="btn btn-outline-danger"
                :disabled="loading"
              >
                Reject
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


<style scoped>
.image-container {
  background-image: url("@/images/img7.jpg");
  background-size: cover;
}

.section-title {
    text-align: center;
    margin-bottom: 50px;
    padding: 30px 0;
    font-size: 50px;
    color:white
  }
  
  .section-title h2 {
    font-size: 50px;
    font-weight: 700;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    color: white;
  }
  
  .section-title h2::before,
  .section-title h2::after {
    content: '';
    flex: 0 0 70px;
    height: 3px;
    background: #36b598;
    display: inline-block;
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
@media (max-width: 768px) {
  
  .section-title h2 {
   font-size: 36px;
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
