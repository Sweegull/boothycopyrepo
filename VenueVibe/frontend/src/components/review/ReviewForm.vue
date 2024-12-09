# ReviewForm.vue
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
            Submit Your Review
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
            <!-- Event ID -->
            <div class="mb-3">
              <label for="eventId" class="form-label">Event ID:</label>
              <input 
                type="text" 
                id="eventId" 
                v-model="formData.eventId" 
                class="form-control" 
                required 
              />
            </div>

            <!-- Username -->
            <div class="mb-3">
              <label for="username" class="form-label">Username:</label>
              <input 
                type="text" 
                id="username" 
                v-model="formData.username" 
                class="form-control" 
                required 
              />
            </div>

            <!-- Category -->
            <div class="mb-3">
              <label for="category" class="form-label">Category:</label>
              <select 
                id="category" 
                v-model="formData.category" 
                class="form-select" 
                required
              >
                <option value="" disabled>Select a category</option>
                <option 
                  v-for="category in categories" 
                  :key="category" 
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Rating -->
            <div class="mb-3">
              <label for="rating" class="form-label">Rating:</label>
              <select 
                id="rating" 
                v-model="formData.rating" 
                class="form-select" 
                required
              >
                <option value="">Select a rating</option>
                <option 
                  v-for="(label, rating) in ratingLabels" 
                  :key="rating" 
                  :value="rating"
                >
                  {{ rating }} - {{ label }}
                </option>
              </select>
            </div>

            <!-- Description -->
            <div class="mb-3">
              <label for="description" class="form-label">Description & Opinion:</label>
              <textarea 
                id="description" 
                v-model="formData.description" 
                class="form-control" 
                rows="4"
                required
              ></textarea>
            </div>
            
            <!-- Transaction Range -->
            <div class="mb-3">
              <label for="transactionRange" class="form-label">Estimated Number of Transactions:</label>
              <select 
                id="transactionRange" 
                v-model="formData.transactionRange" 
                class="form-select"
                required
              >
                <option value="">Select transaction range</option>
                <option value="1-10">1-10 transactions</option>
                <option value="11-30">11-30 transactions</option>
                <option value="31-50">31-50 transactions</option>
                <option value="51-100">51-100 transactions</option>
                <option value="100+">Over 100 transactions</option>
              </select>
            </div>

            <!-- Revenue Range -->
            <div class="mb-3">
              <label for="revenueRange" class="form-label">Estimated Revenue Range:</label>
              <select 
                id="revenueRange" 
                v-model="formData.revenueRange" 
                class="form-select"
                required
              >
                <option value="">Select revenue range</option>
                <option value="0-50">$0-$50</option>
                <option value="50-100">$50-$100</option>
                <option value="100-300">$100-$300</option>
                <option value="300-500">$300-$500</option>
                <option value="500-1000">$500-$1000</option>
                <option value="1000+">Over $1000</option>
              </select>
            </div>

<!-- Modified Image Upload -->
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
                {{ loading ? 'Submitting...' : 'Submit Review' }}
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
import { Modal } from 'bootstrap';
import { ref, onMounted } from 'vue';


const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit']);

// Constants
const categories = [
  'Food & Beverages',
  'Artist, Creator, Crafts',
  'Jewellery & Accessories',
  'Fashion, Apparel & Clothing',
  'Family & Pets',
  'Services',
  'Stationary & supplies',
  'Others'
];

const ratingLabels = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

// State
const modalRef = ref(null);
let modal = null; 
const imagePreview = ref(null);
const formData = ref(getInitialFormData());

// Initialize form data
function getInitialFormData() {
  return {
    eventId: '',
    username: '',
    category: '',
    rating: '',
    description: '',
    imageFile: null,
    imageFileObject: null,
    transactionRange: '', // Add this
    revenueRange: ''     // Add this
  };
}

// Methods
//In your ReviewForm.vue script section
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file');
    return;
  }
  
  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size should be less than 5MB');
    return;
  }

  try {
    // Store the file object for later upload
    formData.value.imageFileObject = file;
    
    // Create preview
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

// Add this helper function for image compression if needed
const compressImage = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions (maintain aspect ratio)
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }));
          },
          'image/jpeg',
          0.7 // compression quality
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
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
  try {
    // Send both the form data and the file object
    emit('submit', {
      ...formData.value,
      imageFileObject: formData.value.imageFileObject // Send the actual file object
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    alert('Failed to submit review. Please try again.');
  }
};
// Modal methods
const openModal = () => {
  if (modal) {
    modal.show();
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