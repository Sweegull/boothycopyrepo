// useReviews.js
import { ref, computed } from 'vue';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase';

export function useReviews() {
  const loading = ref(false);
  const error = ref(null);
  const reviews = ref([]);
  const searchEventId = ref("");

  const reviewsCollection = collection(db, 'reviewData');

  const filteredReviews = computed(() => {
    return searchEventId.value
      ? reviews.value.filter(review => review.eventId === searchEventId.value)
      : reviews.value;
  });

  // Helper function to safely handle timestamps
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return new Date();
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  };

  const formatReviewData = (doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      rating: parseInt(data.rating || 0),
      transactionRange: data.transactionRange || '',
      revenueRange: data.revenueRange || '',
      createdAt: formatTimestamp(data.createdAt)
    };
  };

  const fetchReviews = async () => {
    loading.value = true;
    error.value = null;
    try {
      const querySnapshot = await getDocs(reviewsCollection);
      reviews.value = querySnapshot.docs.map(formatReviewData);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      error.value = 'Failed to load reviews';
    } finally {
      loading.value = false;
    }
  };

  const searchReviews = async () => {
    loading.value = true;
    error.value = null;
    try {
      if (!searchEventId.value) {
        await fetchReviews();
        return;
      }

      const q = query(
        reviewsCollection, 
        where("eventId", "==", searchEventId.value)
      );
      
      const querySnapshot = await getDocs(q);
      reviews.value = querySnapshot.docs.map(formatReviewData);
    } catch (err) {
      console.error('Error searching reviews:', err);
      error.value = 'Failed to search reviews';
    } finally {
      loading.value = false;
    }
  };

  const submitReview = async (reviewData) => {
    loading.value = true;
    error.value = null;
    try {
      // Remove imageFileObject before sending to Firestore
      const { imageFileObject, ...reviewDataWithoutFile } = reviewData;
  
      // Upload image if it exists
      let imageUrl = null;
      if (imageFileObject) {
        const storage = getStorage();
        const timestamp = Date.now();
        const safeFileName = imageFileObject.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filename = `reviewImages/${timestamp}-${safeFileName}`;
        const fileRef = storageRef(storage, filename);
        
        await uploadBytes(fileRef, imageFileObject);
        imageUrl = await getDownloadURL(fileRef);
      }
  
      // Add document to Firestore with new fields
      await addDoc(reviewsCollection, {
        ...reviewDataWithoutFile,
        imageFile: imageUrl,
        rating: parseInt(reviewDataWithoutFile.rating || 0),
        transactionRange: reviewDataWithoutFile.transactionRange,
        revenueRange: reviewDataWithoutFile.revenueRange,
        createdAt: serverTimestamp()
      });
  
      await fetchReviews();
      return true;
    } catch (err) {
      console.error('Error submitting review:', err);
      error.value = err.message || 'Failed to submit review';
      return false;
    } finally {
      loading.value = false;
    }
  };

  

  const setupRealtimeUpdates = () => {
    return onSnapshot(reviewsCollection, (snapshot) => {
      reviews.value = snapshot.docs.map(formatReviewData);
    }, (err) => {
      console.error('Error in realtime updates:', err);
      error.value = 'Failed to get realtime updates';
    });
  };

  return {
    reviews,
    filteredReviews,
    loading,
    error,
    searchEventId,
    fetchReviews,
    searchReviews,
    submitReview,
    setupRealtimeUpdates
  };
}