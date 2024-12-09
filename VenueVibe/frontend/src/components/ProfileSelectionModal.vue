<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Select Application Profile</h2>
          <button @click="$emit('close')" class="close-button">
            <span>&times;</span>
          </button>
        </div>

        <div class="modal-body">
          <div v-if="profiles.length === 0" class="no-profiles">
            <div class="alert alert-info">
              <p>
                No application profiles found. Please create a profile before
                applying for a booth.
              </p>
            </div>
          </div>

          <div v-else class="profiles-grid">
            <div
              v-for="profile in profiles"
              :key="profile.id"
              class="profile-card"
              @click="$emit('selectProfile', profile)"
            >
              <div class="profile-card-content">
                <h3 class="profile-name">{{ profile.name }}</h3>
                <p class="profile-description">{{ profile.description }}</p>
                <div class="profile-focus">Focus: {{ profile.focus }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="$emit('close')" class="btn btn-secondary">
            Cancel
          </button>
          <router-link to="/applicationprofiles" class="btn btn-primary">
            Create New Profile
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileSelectionModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    profiles: {
      type: Array,
      required: true,
    },
    boothDetails: {
      type: Object,
      required: true,
    },
  },
  emits: ["close", "selectProfile"],
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-content {
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.modal-title {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 5px;
}

.close-button:hover {
  color: #333;
}

.modal-body {
  padding: 20px 0;
}

.no-profiles {
  text-align: center;
  padding: 20px;
}

.alert {
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.alert-info {
  background-color: #36b598;
  border: 1px solid #2d9a82;
  color: white;
}

.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 10px;
}

.profile-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #36b598;
}

.profile-card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-size: 1.2rem;
  color: #333;
  margin: 0 0 10px 0;
}

.profile-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
  flex-grow: 1;
}

.profile-focus {
  display: inline-block;
  background-color: #36b598;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #d0d0d0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #36b598;
  color: white;
  text-decoration: none;
  display: inline-block;
}

.btn-primary:hover {
  background-color: #2d9a82;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .profiles-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
