<template>
    
    <div
    v-if="loading"
    class="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
    style="z-index: 1000"
  >
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <body>
    

    <div class="container.fluid py-4 mx-3">
      <div class="container section-title" data-aos="fade-up" style="margin-bottom:0px; padding-bottom:0px">
          <h2>
            <div class="title-with-lines heading-montserrat">
              User Profile Settings
            </div>
          </h2>
        </div>
      
      <div class="row">
        <!-- Profile Photo Column -->
        <div class="col-lg-2 text-center mt-4">
          <input
            type="file"
            @change="uploadProfileImage"
            accept="image/*"
            class="form-control mt-3"
            style="display: none;"
            ref="fileInput"
          />
          <div class="profile-photo-container">
            <img
              @click="selectProfileImage"
              :src="profileImageUrl || 'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'"
              class="rounded-circle mb-4"
              alt="Profile photo"
              width="150px"
              height="150px"
              style="object-fit: cover; cursor: pointer;"
            />
            <i class="fa fa-pencil-alt edit-icon pb-4" aria-hidden="true"></i>
          </div>
          <h3 style="color:white" class="mb-0">{{ username }}</h3>
        </div>
        

        <!-- Main Form Column -->
        <div class="col-lg-8 mt-4">
          <div class="card">
            <div class="card-body">
              
              <form @submit.prevent="updateProfile">
                <!-- Business Name -->
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    v-model="email"
                    type="text"
                    class="form-control"
                    placeholder="Enter Name of Your Business"
                    required
                    disabled
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Business Name</label>
                  <input
                    v-model="business_name"
                    type="text"
                    class="form-control"
                    placeholder="Enter Name of Your Business"
                    required
                  />
                </div>

                <!-- Profile Type Toggle -->
                <div class="mb-3">
                  <label class="form-label">Profile Type</label>
                  <div class="toggle-switch">
                    <input
                      type="checkbox"
                      id="roleToggle"
                      v-model="isCreator"
                      class="toggle-input"
                    />
                    <label for="roleToggle" class="toggle-label">
                      <span class="toggle-text left">Organiser</span>
                      <span class="toggle-text right">Creator</span>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- Collab Toggle -->
                <div class="mb-3">
                  <label class="form-label">Collaboration</label>
                  <div class="toggle-switch">
                    <input
                      type="checkbox"
                      id="collabToggle"
                      v-model="collab"
                      class="toggle-input"
                    />
                    <label for="collabToggle" class="toggle-label">
                      <span class="toggle-text left">No</span>
                      <span class="toggle-text right">Yes</span>
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <!-- Collab Background Upload (appears if collab is true) -->
                <div v-if="collab" class="mb-3">
                  <label class="form-label">Upload Collab Background</label>
                  <input
                    type="file"
                    @change="uploadCollabBackground"
                    accept="image/*"
                    class="form-control"
                    ref="collabBackgroundInput"  
                  />
                </div>

                <!-- Links -->
                <div class="mb-3">
                  <label class="form-label">Website Link</label>
                  <input
                    v-model="website_link"
                    type="text"
                    class="form-control"
                    placeholder="Enter Link to Your Website"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Portfolio Link</label>
                  <input
                    v-model="portfolio_link"
                    type="text"
                    class="form-control"
                    placeholder="Enter Link to Your Portfolio"
                  />
                </div>
                <div class="mb-4">
    
            <label class="form-label fw-semibold"
              >My Interests</label
            >
            <div class="mb-2">
              <div
                v-for="(interest, index) in interests"
                :key="index"
                class="d-flex gap-2 mb-2"
              >
                <input
                  v-model.trim="interests[index]"
                  class="form-control"
                  placeholder="Enter an interest"
                  :disabled="loading"
                />
                <button
                  type="button"
                  @click="removeInterest(index)"
                  class="btn btn-danger"
                  :disabled="loading"
                >
                  ✕
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="addInterest"
              class="btn green-btn"
              :disabled="loading"
            >
              + Add Interest
            </button>
          </div>

                <!-- Business Bio -->
                <div class="mb-3">
                  <label class="form-label">Business Bio</label>
                  <textarea
                    v-model="bio"
                    class="form-control"
                    placeholder="Enter Your Bio"
                    rows="4"
                  ></textarea>
                </div>

                <div class="text-center">
                  <button type="submit" class="btn green-btn-outlined">Save Profile</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Additional Profile Columns -->
        <!-- <div class="col-lg-4 mt-4">
          <div class="row">
            Business Profile Box
            <div class="col-6 col-lg-12 mb-4">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0">Business Profile</h5>
                    <button class="btn green-btn-outlined">
                      <i class="fa fa-plus"></i> Add
                    </button>
                  </div>
                  <div class="mb-3">
                    <span>Profiles:</span>
                  </div>
                  <div class="mb-3">
                    <span>Additional Details:</span>
                  </div>
                </div>
              </div>
            </div>

            Application Profiles Box
            <div class="col-6 col-lg-12 mb-4">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0">Application Profiles</h5>
                    <button class="btn green-btn-outlined">
                      <i class="fa fa-plus"></i> Add
                    </button>
                  </div>
                  <div class="mb-3">
                    <span>Profiles:</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </body>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as necessary
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export default {
  setup() {
    const loading = ref(false); // Loading state
    const auth = getAuth();
    const user = auth.currentUser;
    const storage = getStorage();

    const username = ref('');
    const email = ref('');
    const bio = ref('');
    const business_name = ref('');
    const website_link = ref('');
    const portfolio_link = ref('');
    const interests = ref([]);
    const isCreator = ref(true);
    const collab = ref(false);  // New collab field
    const profileImageUrl = ref('');
    const collabBackgroundUrl = ref('');  // Collab background URL
    const collabBackgroundInput = ref(null); // Ref for collab background input

    const fetchUserData = async () => {
      loading.value = true; // Show loading screen
      if (user) {
        const userDoc = await getDoc(doc(db, 'user', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          username.value = userData.username || '';
          email.value = userData.email || '';
          bio.value = userData.bio || '';
          business_name.value = userData.business_name || '';
          website_link.value = userData.website_link || '';
          portfolio_link.value = userData.portfolio_link || '';
          interests.value = userData.interests || [];
          isCreator.value = userData.profile_type === 'creator';
          collab.value = userData.collab || false;  // Fetch the collab value
          profileImageUrl.value = userData.profile_image || '';
          collabBackgroundUrl.value = userData.collab_background || '';  // Fetch the collab background URL
        }
      }
      loading.value = false; // Hide loading screen
    };

    const updateProfile = async () => {
      loading.value = true; // Show loading screen while updating profile
      if (user) {
        await setDoc(doc(db, 'user', user.uid), {
          bio: bio.value,
          business_name: business_name.value,
          profile_type: isCreator.value ? 'creator' : 'organiser',
          website_link: website_link.value,
          portfolio_link: portfolio_link.value,
          interests: interests.value
              .map((i) => i.trim())
              .filter(Boolean),
          collab: collab.value,  // Update collab value
        }, { merge: true });
        alert('Profile updated successfully!');
      }
      loading.value = false; // Hide loading screen after updating
    };

    const uploadProfileImage = async (event) => {
      const file = event.target.files[0];
      if (file && user) {
        loading.value = true; // Show loading during upload
        const storagePath = `profile_images/${user.uid}/${file.name}`;
        const fileRef = storageRef(storage, storagePath);

        try {
          await uploadBytes(fileRef, file);
          const downloadUrl = await getDownloadURL(fileRef);
          await setDoc(doc(db, 'user', user.uid), { profile_image: downloadUrl }, { merge: true });
          profileImageUrl.value = downloadUrl;
        } catch (error) {
          console.error('Error uploading profile image:', error);
        } finally {
          loading.value = false; // Hide loading after upload
        }
      }
    };

    const uploadCollabBackground = async (event) => {
      const file = event.target.files[0];
      if (file && user) {
        loading.value = true; // Show loading during upload
        const storagePath = `collab_backgrounds/${user.uid}/${file.name}`;
        const fileRef = storageRef(storage, storagePath);

        try {
          await uploadBytes(fileRef, file);
          const downloadUrl = await getDownloadURL(fileRef);
          await setDoc(doc(db, 'user', user.uid), { collab_background: downloadUrl }, { merge: true });
          collabBackgroundUrl.value = downloadUrl;
        } catch (error) {
          console.error('Error uploading collab background:', error);
        } finally {
          loading.value = false; // Hide loading after upload
        }
      }
    };

    const selectProfileImage = () => {
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.click();
      }
    };

    const addInterest = () => {
      interests.value.push("");
    };

    const removeInterest = (index) => {
      interests.value.splice(index, 1);
    };

    onMounted(() => {
      fetchUserData(); // Fetch user data on component mount
    });

    return {
      loading, // Return loading state
      username,
      email,
      bio,
      business_name,
      website_link,
      portfolio_link,
      interests,
      isCreator,
      collab,
      profileImageUrl,
      collabBackgroundUrl,
      collabBackgroundInput,
      uploadProfileImage,
      uploadCollabBackground,
      selectProfileImage,
      updateProfile,
      addInterest,
      removeInterest
    };
  },
};
</script>


<style src="@/styles/review.css" scoped />
  
  <style scoped>

body {
  background-image:url('@/images/img12.jpg');
  background-size: cover;
  
}


.profile-photo-container {
position: relative; /* Position relative to contain the icon */
display: inline-block; /* Allow the container to size around the image */
}

.card{
  background-color: rgba(255,255,255,0.9);
}

img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  transition: transform 0.3s ease, filter 0.3s ease; /* Transition for smooth scaling and filtering */
}

img:hover {
  transform: scale(1.1); /* Enlarge the image */
  filter: brightness(0.4); /* Darken the image */
}

.edit-icon {
  position: absolute; /* Position absolute to the container */
  top: 50%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%); /* Adjust to center */
  font-size: 38px; /* Icon size */
  color: white; /* Icon color */
  opacity: 0; /* Initially hidden */
  transition: opacity 0.3s ease; /* Smooth transition for opacity */
}

.profile-photo-container:hover .edit-icon {
  opacity: 1; /* Show icon on hover */
}
  
  .form-control:focus {
    box-shadow: none;
    border-color: #36b598;
  }
  
  .labels {
    font-size: 11px;
  }
  
  .toggle-switch {
    position: relative;
    width: auto;
    height: 40px;
  }
  
  .toggle-input {
    display: none;
  }
  
  .toggle-label {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    background-color: #e0e0e0;
    border-radius: 20px;
    cursor: pointer;
  }
  
  .toggle-slider {
    position: absolute;
    width: 50%;
    height: 100%;
    background-color: rgb(87, 147, 196);

    border-radius: 20px;
    transition: 0.3s;
  }
  
  .toggle-text {
    position: absolute;
    width: 50%;
    line-height: 40px;
    text-align: center;
    font-weight: bold;
    z-index: 2;
  }
  
  .toggle-text.left {
    left: 0;
    color: #ffffff;
  }
  
  .toggle-text.right {
    right: 0;
    color: grey;
  }
  
  .toggle-input:checked + .toggle-label .toggle-slider {
    left: 50%;
    background-color: #36b598;
  }
  
  .toggle-input:checked + .toggle-label .toggle-text.left {
    color: grey;
  }
  
  .toggle-input:checked + .toggle-label .toggle-text.right {
    color:white;
  }
  </style>
  


            <!-- #Address
            <div class="mb-3">
              <label class="form-label">Address Line 1</label>
              <input type="text" class="form-control" placeholder="Enter address line 1">
            </div>
            <div class="mb-3">
              <label class="form-label">Address Line 2</label>
              <input type="text" class="form-control" placeholder="Enter address line 2">
            </div>
            <div class="mb-3">
              <label class="form-label">Postal Code</label>
              <input type="text" class="form-control" placeholder="Enter address line 2">
            </div>

            #Location 
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label">Country</label>
                <input type="text" class="form-control" placeholder="Enter country">
              </div>
              <div class="col-md-6">
                <label class="form-label">State/Region</label>
                <input type="text" class="form-control" placeholder="Enter state/region">
              </div>
            </div> -->