<template>
  <div 
    class="modal fade" 
    id="reviewModal" 
    tabindex="-1" 
    aria-labelledby="reviewModalLabel" 
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="reviewModalLabel">
            <i class="bi bi-pencil-square me-2"></i>
            Submit Your Booth
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            data-bs-dismiss="modal" 
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <!-- Event Name -->
            <div class="mb-3">
              <label for="boothTitle" class="form-label">Event Name:</label>
              <input 
                type="text" 
                id="boothTitle" 
                v-model="formData.boothTitle" 
                class="form-control" 
                required 
              />
            </div>
            <!-- Event ID -->
            <div class="mb-3">
              <label for="event_id" class="form-label">Event ID:</label>
              <input 
                type="text" 
                id="event_id" 
                v-model="formData.event_id" 
                class="form-control" 
                required
                readonly
              />
            </div>
            <!-- Start and End Date -->
            <div class="mb-3 row">
              <!-- Start Date -->
              <div class="col-md-6">
                <label for="startDate" class="form-label">Start Date:</label>
                <input 
                  type="date" 
                  id="startDate" 
                  v-model="formData.dateFrom" 
                  class="form-control" 
                  required 
                />
              </div>
              <!-- End Date -->
              <div class="col-md-6">
                <label for="endDate" class="form-label">End Date:</label>
                <input 
                  type="date" 
                  id="endDate" 
                  v-model="formData.dateTo" 
                  class="form-control" 
                  required 
                />
              </div>
            </div>

            <!-- Price -->
            <div class="mb-3">
              <label for="price" class="form-label">Price:</label>
              <input 
                type="number" 
                id="price" 
                v-model="formData.price" 
                class="form-control" 
                required 
                step="0.01"  
                min="0" 
                placeholder="Enter price"
              />
            </div>

            <!-- Duration -->
            <div class="mb-3">
              <label for="duration" class="form-label">Duration:</label>
              <input 
                type="number" 
                id="duration" 
                v-model="formData.duration" 
                class="form-control" 
                required 
                min="0" 
                placeholder="Enter duration"
              />
            </div>

            <!-- Space -->
            <div class="mb-3">
              <label for="space" class="form-label">No. of Available Slots:</label>
              <input 
                type="number" 
                id="space" 
                v-model="formData.space" 
                class="form-control" 
                required 
                min="0" 
                placeholder="Enter number of available booths"
              />
            </div>

            <!-- Postal Code -->
            <div class="mb-3">
              <label for="postal_code" class="form-label">Postal Code:</label>
              <input 
                type="text" 
                id="postal_code" 
                v-model="formData.postal_code" 
                class="form-control" 
                required 
              />
            </div>

            <!-- Description -->
            <div class="mb-3">
              <label for="description" class="form-label">Description:</label>
              <textarea 
                id="description" 
                v-model="formData.description" 
                class="form-control" 
                rows="4"
                required
              ></textarea>
            </div>

            <!-- Image Upload -->
            <div class="mb-3">
              <label for="imageFile" class="form-label">Upload Image (optional):</label>
              <input 
                type="file" 
                id="imageFile" 
                class="form-control" 
                accept="image/*"
                @change="handleImageUpload"
                :disabled="loading"
              />
              <!-- Image Preview -->
              <div v-if="imagePreview" class="mt-2 preview-container position-relative">
                <img 
                  :src="imagePreview" 
                  class="review-preview-image img-fluid"
                  alt="Preview" 
                  style="max-height: 200px;"
                />
                <button 
                  type="button" 
                  class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                  @click="removeImage"
                >
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="text-end">
              <button 
                type="submit" 
                class="btn green-btn"
                :disabled="loading"
              >
                <i class="bi bi-check-circle me-1"></i>
                {{ loading ? 'Submitting...' : 'Add Booth' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, collection, setDoc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure correct import path to your Firebase config
import { getAuth } from 'firebase/auth';
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';


const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit']);

// State
const modalRef = ref(null);
let modal = null; 
const imagePreview = ref(null);
const formData = ref(getInitialFormData());
const loading = ref(false);  // To manage the loading state

// Initialize form data
function getInitialFormData() {
  return {
    boothTitle: '',
    event_id: '',
    price: '',
    duration: '',
    space: '',
    postal_code: '',
    description: '',
    imageFile: null,
    imageFileObject: null,
    dateFrom: '', // Start date field
    dateTo: '',   // End date field
  };
}

// Methods
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type and size
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB');
    return;
  }

  try {
    formData.value.imageFileObject = file;

    // Create a preview
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.imageFile = e.target.result;
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error handling image:', error);
    alert('Failed to process image. Please try again.');
  }
};

const removeImage = () => {
  if (formData.value.imageFile?.startsWith('blob:')) {
    URL.revokeObjectURL(formData.value.imageFile);
  }
  formData.value.imageFile = null;
  formData.value.imageFileObject = null;
};

const resetForm = () => {
  formData.value = getInitialFormData();
  imagePreview.value = null;
};

const handleSubmit = async () => {
  loading.value = true; // Start loading
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in to submit a booth.');
      return;
    }

    // Fetch user profile to get business_name (organizer_id)
    const userDoc = await getDoc(doc(db, 'user', user.uid));
    if (!userDoc.exists()) {
      alert('User profile not found.');
      return;
    }

    const businessName = userDoc.data().business_name; // Get the business name

    // Fetch the number of documents in the booths collection
    const boothsSnapshot = await getDocs(collection(db, 'booths'));
    const docCount = boothsSnapshot.size;

    // Dynamically generate event_id as 'event_' + document count
    const eventId = `event_${docCount}`;

    let imageUrl = null;
    const imageFile = formData.value.imageFileObject;

    if (imageFile) {
      // Upload image to Firebase Storage
      const storage = getStorage();
      const storagePath = `booths/${user.uid}/${imageFile.name}`;
      const storageRefInstance = storageRef(storage, storagePath);

      const snapshot = await uploadBytes(storageRefInstance, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref); // Get the image URL after upload
    }

    // Save booth data to Firestore
    const boothData = {
      booth_title: formData.value.boothTitle,
      event_id: eventId,
      price: parseFloat(formData.value.price),
      duration: parseInt(formData.value.duration, 10),
      size: parseInt(formData.value.space, 10),
      postal_code: formData.value.postal_code,
      description: formData.value.description,
      booth_image: imageUrl, // The URL of the uploaded image
      organizer_id: businessName, // The business name from the user profile
      created_at: new Date(), // Timestamp for when the booth was added
      updated_at: new Date(),
      date_from: new Date(formData.value.dateFrom),  // Start date converted to Date object
      date_to: new Date(formData.value.dateTo),      // End date converted to Date object
    };

    // Create a new booth document under the 'booths' collection
    await setDoc(doc(db, 'booths', user.uid + '_' + Date.now()), boothData);

    alert('Booth submitted successfully!');
    closeModal();

  } catch (error) {
    console.error('Error submitting booth:', error);
    alert('Failed to submit the booth. Please try again.');
  } finally {
    loading.value = false; // Stop loading after submission
  }
};

// Modal methods
const openModal = async () => {
  try {
    // Fetch the number of documents in the booths collection
    const boothsSnapshot = await getDocs(collection(db, 'booths'));
    const docCount = boothsSnapshot.size;

    // Dynamically generate event_id as 'event_' + document count
    formData.value.event_id = `event_${docCount}`;
    
    if (modal) {
      modal.show();
    }
  } catch (error) {
    console.error('Error fetching booth count:', error);
  }
};

const closeModal = () => {
  if (modal) {
    modal.hide();
    resetForm();
  }
};

// Lifecycle hooks
onMounted(() => {
  if (modalRef.value) {
    modal = new Modal(modalRef.value);
    
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      resetForm();
    });
  }
});

// Expose methods to parent
defineExpose({
  openModal,
  closeModal
});
</script>
<style src="@/styles/review.css" scoped />
<style scoped>
.preview-container {
  max-width: 100%;
  overflow: hidden;
  border-radius: 4px;
}

.review-preview-image {
  width: 100%;
  object-fit: contain;
}
</style>
