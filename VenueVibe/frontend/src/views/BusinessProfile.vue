<template>
<div class="img-container">
  <div class="container section-title" data-aos="fade-up">
    <h2>
      <div class="title-with-lines" style="color:white">
        Business Profile
      </div>
    </h2>
  </div>
  <div class="container pb-5" >
    <div
      v-if="loading"
      class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
      style="z-index: 1000"
    >
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="card shadow-sm " style="background-color:rgb(250,250,250,0.8); opacity:">
      <div class="card-body">
        <div v-if="hasProfile && !isEditing">
          <div class="mb-4">
            <h3 class="h5 fw-bold">Business Name</h3>
            <p>{{ business_name }}</p>
          </div>

          <div class="mb-4">
            <h3 class="h5 fw-bold">Business Description</h3>
            <p>{{ description }}</p>
          </div>

          <div class="mb-4">
            <h3 class="h5 fw-bold">Business Services Offered</h3>
            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="(service, index) in services_offered"
                :key="index"
                class="badge service-badge"
              >
                {{ service }}
              </span>
            </div>
          </div>

          <div class="mb-4">
            <h3 class="h5 fw-bold">Business Experience</h3>
            <p>{{ experience }}</p>
          </div>

          <div class="mb-4">
            <h3 class="h5 fw-bold">Products</h3>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in products" :key="product.id">
                    <td>
                      <img
                        :src="product.imageUrl || '/default-product.png'"
                        alt="Product image"
                        class="product-thumbnail"
                      />
                    </td>
                    <td>{{ product.name }}</td>
                    <td>${{ product.price.toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <button
              @click="toggleEdit"
              class="btn custom-btn"
              :disabled="loading"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <form v-else @submit.prevent="saveBusinessProfile">
          <div class="mb-4">
            <label for="business_name" class="form-label fw-semibold"
              >Business Name</label
            >
            <input
              id="business_name"
              v-model.trim="business_name"
              class="form-control"
              placeholder="Enter your business name"
              :disabled="loading"
              required
            />
          </div>

          <div class="mb-4">
            <label for="description" class="form-label fw-semibold"
              >Business Description</label
            >
            <textarea
              id="description"
              v-model.trim="description"
              class="form-control"
              placeholder="Describe your business"
              rows="4"
              :disabled="loading"
              required
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold"
              >Business Services Offered</label
            >
            <div class="mb-2">
              <div
                v-for="(service, index) in services_offered"
                :key="index"
                class="d-flex gap-2 mb-2"
              >
                <input
                  v-model.trim="services_offered[index]"
                  class="form-control"
                  placeholder="Enter a service"
                  :disabled="loading"
                />
                <button
                  type="button"
                  @click="removeService(index)"
                  class="btn btn-danger"
                  :disabled="loading"
                >
                  ✕
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="addService"
              class="btn green-btn"
              :disabled="loading"
            >
              + Add Service
            </button>
          </div>

          <div class="mb-4">
            <label for="experience" class="form-label fw-semibold"
              >Business Experience</label
            >
            <textarea
              id="experience"
              v-model.trim="experience"
              class="form-control"
              placeholder="Describe your business experience"
              rows="4"
              :disabled="loading"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">Products</label>
            <div class="mb-2">
              <div
                v-for="product in products"
                :key="product.id"
                class="d-flex gap-3 mb-3 align-items-start product-row"
              >
                <div class="product-image-container">
                  <img
                    :src="
                      product.imageUrl ||
                      product.tempImageUrl ||
                      '/default-product.png'
                    "
                    alt="Product image"
                    class="product-thumbnail mb-2"
                  />
                  <input
                    type="file"
                    :id="'product-image-' + product.id"
                    class="d-none"
                    accept="image/*"
                    @change="(e) => handleImageUpload(e, product.id)"
                    :disabled="loading"
                  />
                  <label
                    :for="'product-image-' + product.id"
                    class="btn btn-sm btn-outline-primary w-100"
                    :disabled="loading"
                  >
                    {{ product.imageUrl ? "Change Image" : "Add Image" }}
                  </label>
                </div>

                <div class="flex-grow-1">
                  <div class="mb-2">
                    <label class="form-label small">Product Name</label>
                    <input
                      v-model.trim="product.name"
                      class="form-control"
                      placeholder="Product name"
                      :disabled="loading"
                      required
                    />
                  </div>
                  <div>
                    <label class="form-label small">Price</label>
                    <input
                      v-model.number="product.price"
                      type="number"
                      step="0.01"
                      min="0"
                      class="form-control"
                      placeholder="Price"
                      :disabled="loading"
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  @click="removeProduct(product.id)"
                  class="btn btn-danger"
                  :disabled="loading"
                >
                  ✕
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="addProduct"
              class="btn green-btn"
              :disabled="loading"
            >
              + Add Product
            </button>
          </div>

          <div class="d-flex gap-2">
            <button
              v-if="hasProfile"
              type="button"
              @click="toggleEdit"
              class="btn btn-secondary flex-grow-1"
              :disabled="loading"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-success flex-grow-1"
              :disabled="loading || !isFormValid"
            >
              {{ loading ? "Saving..." : "Save Business Profile" }}
            </button>
          </div>
        </form>

        <div
          v-if="notification"
          class="position-fixed bottom-0 end-0 p-3"
          style="z-index: 1000"
        >
          <div
            :class="[
              'alert',
              notification.type === 'success'
                ? 'alert-success'
                : 'alert-danger',
            ]"
            role="alert"
          >
            {{ notification.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { db } from "../firebase"; 
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

export default {
  name: "BusinessProfile",
  setup() {
    const auth = getAuth();
    const user = auth.currentUser;
    const storage = getStorage();
    const business_name = ref("");
    const description = ref("");
    const services_offered = ref([]);
    const experience = ref("");
    const products = ref([]);
    const userId = ref(null);
    const loading = ref(false);
    const notification = ref(null);
    const hasProfile = ref(false);
    const isEditing = ref(false);

    const isFormValid = computed(() => {
      return (
        business_name.value.trim() &&
        description.value.trim() &&
        products.value.every((p) => p.name.trim() && p.price >= 0)
      );
    });

    const showNotification = (message, type = "success") => {
      notification.value = { message, type };
      setTimeout(() => {
        notification.value = null;
      }, 3000);
    };

    const fetchBusinessProfile = async () => {
      loading.value = true;
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          business_name.value = userData.business_name || "";
          description.value = userData.bio || "";
        }

        const businessDocRef = doc(db, "business_profiles", user.uid);
        const businessDocSnap = await getDoc(businessDocRef);

        if (businessDocSnap.exists()) {
          const businessData = businessDocSnap.data();
          services_offered.value = businessData.services_offered || [];
          experience.value = businessData.experience || "";
          products.value = businessData.products || [];
          hasProfile.value = true;
        }
      } catch (error) {
        console.error("Error fetching business profile: ", error);
        showNotification("Failed to load business profile", "error");
      } finally {
        loading.value = false;
      }
    };

    const handleImageUpload = async (event, productId) => {
      const file = event.target.files[0];
      if (!file) return;

      const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
      if (!acceptedImageTypes.includes(file.type)) {
        showNotification(`Please upload a valid image file (JPEG, PNG, GIF, WebP, or BMP). Received type: ${file.type}`, "error");
        return;
      }

      const maxSize = 5 * 1024 * 1024; 
      if (file.size > maxSize) {
        showNotification(`Image size should be less than 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`, "error");
        return;
      }

      loading.value = true;

      try {
        console.log('Starting image upload for file:', {
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
        });

        const timestamp = new Date().getTime();
        const filename = `${timestamp}_${file.name}`;

        const imageRef = storageRef(
          storage, 
          `product-images/${user.uid}/${productId}/${filename}`
        );

        console.log('Uploading to path:', imageRef.fullPath);

        const uploadResult = await uploadBytes(imageRef, file);
        console.log('Upload completed:', uploadResult);

        const downloadURL = await getDownloadURL(imageRef);
        console.log('Download URL obtained:', downloadURL);

        const productIndex = products.value.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
          products.value[productIndex].tempImageUrl = URL.createObjectURL(file);
          products.value[productIndex].imageUrl = downloadURL;
          products.value[productIndex].imagePath = imageRef.fullPath;
        }

        showNotification("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", {
          code: error.code,
          message: error.message,
          fullError: error
        });
        
        let errorMessage = "Failed to upload image";
        if (error.code === 'storage/unauthorized') {
          errorMessage = "Permission denied: Please check if you're logged in";
        } else if (error.code === 'storage/canceled') {
          errorMessage = "Upload was cancelled";
        } else if (error.code === 'storage/unknown') {
          errorMessage = "An unknown error occurred during upload";
        }
        
        showNotification(errorMessage, "error");
      } finally {
        loading.value = false;
      }
    };

    const addProduct = () => {
      products.value.push({
        id: Date.now(),
        name: "",
        price: 0,
        imageUrl: "",
        tempImageUrl: null,
        imagePath: null
      });
    };

    const removeProduct = async (id) => {
      const product = products.value.find(p => p.id === id);
      
      if (product && product.imagePath) {
        try {
          const imageRef = storageRef(storage, product.imagePath);
          await deleteObject(imageRef);
        } catch (error) {
          console.error("Error deleting product image:", error);
        }
      }
      
      products.value = products.value.filter(product => product.id !== id);
    };

    const addService = () => {
      services_offered.value.push("");
    };

    const removeService = (index) => {
      services_offered.value.splice(index, 1);
    };

    const saveBusinessProfile = async () => {
      if (!isFormValid.value) return;

      loading.value = true;
      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            business_name: business_name.value.trim(),
            bio: description.value.trim(),
          },
          { merge: true }
        );

        await setDoc(
          doc(db, "business_profiles", user.uid),
          {
            services_offered: services_offered.value
              .map((i) => i.trim())
              .filter(Boolean),
            experience: experience.value.trim(),
            products: products.value.map(p => ({
              id: p.id,
              name: p.name.trim(),
              price: Number(p.price),
              imageUrl: p.imageUrl || "",
              imagePath: p.imagePath || ""
            })),
          },
          { merge: true }
        );

        hasProfile.value = true;
        isEditing.value = false;
        showNotification("Business profile saved successfully");

        products.value.forEach(product => {
          if (product.tempImageUrl) {
            URL.revokeObjectURL(product.tempImageUrl);
            delete product.tempImageUrl;
          }
        });
      } catch (error) {
        console.error("Error saving business profile:", error);
        showNotification("Failed to save business profile", "error");
      } finally {
        loading.value = false;
      }
    };

    const toggleEdit = () => {
      isEditing.value = !isEditing.value;
      
      if (!isEditing.value) {
        products.value.forEach(product => {
          if (product.tempImageUrl) {
            URL.revokeObjectURL(product.tempImageUrl);
            delete product.tempImageUrl;
          }
        });
      }
    };

    onMounted(() => {
      const user = auth.currentUser;
      if (user) {
        userId.value = user.uid;
        fetchBusinessProfile();
      }
    });

    return {
      business_name,
      description,
      services_offered,
      experience,
      products,
      loading,
      notification,
      hasProfile,
      isEditing,
      isFormValid,
      saveBusinessProfile,
      toggleEdit,
      addService,
      removeService,
      addProduct,
      removeProduct,
      handleImageUpload,
    };
  },
};
</script>

<style src="@/styles/review.css" scoped />

<style scoped>
.img-container{
  background-image: url('@/images/img11.jpg');
  background-size: 1000px auto;
}
.section-title {
  text-align: center;
  margin-bottom: 0px;
  padding: 30px 0;
}

.section-title h2 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.title-with-lines {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.line {
  width: 70px;
  height: 3px;
  background: #36b598;
  display: inline-block;
}

.service-badge {
  background-color: #36b598;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
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

.product-thumbnail {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.product-image-container {
  width: 100px;
}
</style>
