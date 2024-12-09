// useFileUpload.js
import { ref } from 'vue';
import { 
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { storage } from '../firebase';

export function useFileUpload() {
  const uploading = ref(false);
  const progress = ref(0);
  const error = ref(null);

  const validateFile = (file, options = {}) => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
      customValidation = null
    } = options;

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > maxSize) {
      throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    // Run custom validation if provided
    if (customValidation && typeof customValidation === 'function') {
      const customError = customValidation(file);
      if (customError) {
        throw new Error(customError);
      }
    }

    return true;
  };

  const uploadFile = async (file, options = {}) => {
    const {
      path = 'uploads',
      fileName = null,
      validation = {}
    } = options;

    uploading.value = true;
    progress.value = 0;
    error.value = null;

    try {
      // Validate file
      validateFile(file, validation);

      // Generate unique filename if not provided
      const finalFileName = fileName || `${path}/${Date.now()}-${file.name}`;
      const fileRef = storageRef(storage, finalFileName);

      // Create upload task
      const uploadTask = uploadBytes(fileRef, file);

      // Track upload progress
      uploadTask.on('state_changed', 
        (snapshot) => {
          progress.value = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          throw error;
        }
      );

      // Wait for upload to complete
      const snapshot = await uploadTask;
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        url: downloadURL,
        path: finalFileName,
        ref: fileRef
      };

    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      uploading.value = false;
    }
  };

  const deleteFile = async (filePath) => {
    try {
      const fileRef = storageRef(storage, filePath);
      await deleteObject(fileRef);
      return true;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const createObjectURL = (file) => {
    return URL.createObjectURL(file);
  };

  const revokeObjectURL = (url) => {
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  };

  return {
    uploading,
    progress,
    error,
    uploadFile,
    deleteFile,
    validateFile,
    createObjectURL,
    revokeObjectURL
  };
}