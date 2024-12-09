<template>
<div class="img-container">
  <div class="container section-title" data-aos="fade-up">
    <h2>
      <div class="title-with-lines"style="color:white">
        Application Profiles
      </div>
    </h2>
  </div>

  <div class="container pb-5">
    <div v-if="showNewProfileForm" class="card shadow-sm">
      <div class="card-body">
        <h3 class="h5 mb-4">
          {{ editingProfileId ? "Edit" : "Create New" }} Application Profile
        </h3>
        <div class="mb-4">
          <div class="mb-3">
            <label class="form-label">Profile Name</label>
            <input
              v-model="newProfile.name"
              placeholder="Enter profile name"
              class="form-control mb-3"
              required
            />

            <label class="form-label">Profile Description</label>
            <textarea
              v-model="newProfile.description"
              placeholder="Enter profile description"
              class="form-control mb-3"
              style="min-height: 100px"
              required
            >
            </textarea>

            <label class="form-label">Profile Focus:(e.g. Sustainability, Charity, Crafts)</label>
            <input
              v-model="newProfile.focus"
              placeholder="Enter profile focus"
              class="form-control"
              required
            />
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button @click="cancelEdit" class="btn btn-outline-secondary">
              Cancel
            </button>
            <button
              @click="saveProfile"
              class="btn custom-btn"
              :disabled="!isFormValid"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="profiles-list">
      <h3 class="h4 mb-4" v-if="profiles.length > 0">Your Profiles</h3>

      <div class="row g-4">
        <div v-for="profile in profiles" :key="profile.id" class="col-md-3">
          <div class="card shadow-sm hover-shadow h-100">
            <div class="card-body d-flex flex-column">
              <div class="profile-info flex-grow-1">
                <div class="d-flex justify-content-between">
                  <h4 class="h5 mb-3">{{ profile.name }}</h4>
                  <!-- <span class="text-muted small">
                    Created: {{ formatDate(profile.createdAt) }}
                  </span> -->
                </div>
                <p class="text-muted mb-2">{{ profile.description }}</p>
                <div class="d-flex align-items-center gap-2">
                  <span class="badge custom-badge">
                    Focus: {{ profile.focus }}
                  </span>
                </div>
              </div>
              <div
                class="profile-actions mt-3 d-flex justify-content-end gap-2"
              >
                <button
                  @click="editProfile(profile.id)"
                  class="btn btn-outline-custom btn-sm"
                >
                  Edit
                </button>
                <button
                  @click="confirmDelete(profile.id)"
                  class="btn btn-outline-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="profiles.length === 0" class="text-center py-5 text-white">
        <p>
          No application profiles created yet. Create your first profile to get
          started!
        </p>
      </div>

      <button
        @click="showNewProfileForm = true"
        class="btn custom-btn w-100 mt-4"
        v-if="!showNewProfileForm"
      >
        Create New Application Profile
      </button>
    </div>
  </div>
</div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default {
  name: "profiles",
  setup() {
    const auth = getAuth();
    const user = auth.currentUser;
    const storage = getStorage();
    const profiles = ref([]);
    const showNewProfileForm = ref(false);
    const newProfile = reactive({
      name: "",
      description: "",
      focus: "",
    });
    const userId = ref(null);
    const editingProfileId = ref(null);

    const isFormValid = computed(() => {
      return (
        newProfile.name.trim() &&
        newProfile.description.trim() &&
        newProfile.focus.trim()
      );
    });

    const fetchProfiles = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "application_profiles", user.uid, "profiles")
        );
        profiles.value = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          }))
          .sort((a, b) => b.createdAt - a.createdAt);
      } catch (error) {
        console.error("Error fetching profiles: ", error);
      }
    };

    const saveProfile = async () => {
      if (!isFormValid.value) return;

      try {
        const profileData = {
          ...newProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        if (editingProfileId.value) {
          await updateDoc(
            doc(
              db,
              "application_profiles",
              user.uid,
              "profiles",
              editingProfileId.value
            ),
            profileData
          );
        } else {
          await addDoc(
            collection(db, "application_profiles", user.uid, "profiles"),
            profileData
          );
        }

        showNewProfileForm.value = false;
        editingProfileId.value = null;
        Object.assign(newProfile, { name: "", description: "", focus: "" });
        await fetchProfiles();
      } catch (error) {
        console.error("Error saving profile: ", error);
      }
    };

    const editProfile = (id) => {
      const profile = profiles.value.find((p) => p.id === id);
      if (profile) {
        Object.assign(newProfile, profile);
        editingProfileId.value = id;
        showNewProfileForm.value = true;
      }
    };

    const confirmDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this profile?")) {
        await deleteProfile(id);
      }
    };

    const deleteProfile = async (id) => {
      try {
        await deleteDoc(
          doc(db, "application_profiles", user.uid, "profiles", id)
        );
        await fetchProfiles();
      } catch (error) {
        console.error("Error deleting profile: ", error);
      }
    };

    const cancelEdit = () => {
      showNewProfileForm.value = false;
      editingProfileId.value = null;
      Object.assign(newProfile, { name: "", description: "", focus: "" });
    };

    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    onMounted(() => {
      const user = auth.currentUser;
      if (user) {
        userId.value = user.uid;
        fetchProfiles();
      }
    });

    return {
      profiles,
      showNewProfileForm,
      newProfile,
      isFormValid,
      saveProfile,
      editProfile,
      deleteProfile,
      confirmDelete,
      cancelEdit,
      editingProfileId,
      formatDate,
    };
  },
};
</script>


<style src="@/styles/review.css" scoped />
<style scoped>


.img-container{
  background-image: url('@/images/marketdark.jpg');
  background-size: 1000px auto;
}
.hover-shadow {
  transition: box-shadow 0.3s ease;
}

.hover-shadow:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.badge {
  padding: 0.5em 1em;
}

.custom-badge {
  background-color: #36b598;
  color: white;
}

.custom-btn {
  background-color: #36b598;
  border-color: #36b598;
  color: white;
}

.custom-btn:hover {
  background-color: #2d9a82;
  border-color: #2d9a82;
  color: white;
}

.custom-btn:disabled {
  background-color: #36b598;
  border-color: #36b598;
  opacity: 0.65;
}

.btn-outline-custom {
  color: #36b598;
  border-color: #36b598;
}

.btn-outline-custom:hover {
  background-color: #36b598;
  border-color: #36b598;
  color: white;
}

.profiles-list {
  margin-top: 2rem;
}

.card {
  height: 100%;
  background-color: rgba(254, 254, 254, 0.85);
}

.profile-info {
  padding-right: 1rem;
  flex-grow: 1;
}

.profile-actions {
  border-top: 1px solid #eee;
  padding-top: 1rem;
  margin-top: auto;
}

.section-title {
  text-align: center;
  padding: 30px 0;
}

.section-title h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
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

.section-title {
  animation: fadeIn 1.5s;
}
</style>
