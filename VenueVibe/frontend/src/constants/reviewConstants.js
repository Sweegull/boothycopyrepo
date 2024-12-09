// reviewConstants.js

// Review Categories
export const REVIEW_CATEGORIES = {
    FOOD: 'Food & Beverages',
    ARTIST: 'Artist, Creator, Crafts',
    JEWELRY: 'Jewellery & Accessories',
    FASHION: 'Fashion, Apparel & Clothing',
    FAMILY: 'Family & Pets',
    OTHERS: 'Others'
  };
  
  // Rating System
  export const RATING_LABELS = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };
  
  // Detailed Rating Descriptions
  export const RATING_DESCRIPTIONS = {
    1: 'Major improvements needed. Well below expectations.',
    2: 'Some issues present. Below average experience.',
    3: 'Meets basic expectations. Average experience.',
    4: 'Exceeds expectations. Very pleasant experience.',
    5: 'Outstanding. Exceptional experience in every way.'
  };
  
  // File Upload Constraints
  export const FILE_UPLOAD = {
    IMAGE: {
      MAX_SIZE: 5 * 1024 * 1024, // 5MB in bytes
      ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
      MAX_DIMENSION: 2048, // max width/height in pixels
      MIN_DIMENSION: 200, // min width/height in pixels
    },
    VIDEO: {
      MAX_SIZE: 50 * 1024 * 1024, // 50MB in bytes
      ALLOWED_TYPES: ['video/mp4', 'video/quicktime'],
      MAX_DURATION: 180, // maximum duration in seconds
    }
  };
  
  // Form Validation Rules
  export const VALIDATION_RULES = {
    USERNAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 50,
      PATTERN: /^[a-zA-Z0-9_\- ]+$/,
      ERROR_MESSAGES: {
        required: 'Username is required',
        minLength: 'Username must be at least 3 characters',
        maxLength: 'Username cannot exceed 50 characters',
        pattern: 'Username can only contain letters, numbers, spaces, hyphens and underscores'
      }
    },
    DESCRIPTION: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 500,
      ERROR_MESSAGES: {
        required: 'Description is required',
        minLength: 'Description must be at least 10 characters',
        maxLength: 'Description cannot exceed 500 characters'
      }
    },
    EVENT_ID: {
      PATTERN: /^[A-Z0-9]{6,}$/,
      ERROR_MESSAGES: {
        required: 'Event ID is required',
        pattern: 'Event ID must be at least 6 characters and contain only uppercase letters and numbers'
      }
    }
  };
  
  // Chart Colors
  export const CHART_COLORS = {
    PRIMARY: '#36b598',
    SECONDARY: '#2d9b82',
    GRADIENT: [
      '#36b598', // Primary
      '#2d9b82', // Secondary
      '#248169', // Darker variations
      '#1b6751',
      '#124d3a',
      '#093322'  // Darkest
    ]
  };
  
  // Animation Durations (in milliseconds)
  export const ANIMATION = {
    FADE: 200,
    SLIDE: 300,
    BOUNCE: 500
  };
  
  // Error Messages
  export const ERROR_MESSAGES = {
    FETCH_FAILED: 'Failed to load reviews. Please try again.',
    SUBMIT_FAILED: 'Failed to submit review. Please try again.',
    UPLOAD_FAILED: 'Failed to upload file. Please try again.',
    INVALID_FILE: 'Invalid file format or size.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    PERMISSION_DENIED: 'Permission denied. Please log in.',
    SESSION_EXPIRED: 'Session expired. Please log in again.'
  };
  
  // Sort Options
  export const SORT_OPTIONS = {
    NEWEST: {
      label: 'Newest First',
      value: 'newest',
      field: 'createdAt',
      order: 'desc'
    },
    OLDEST: {
      label: 'Oldest First',
      value: 'oldest',
      field: 'createdAt',
      order: 'asc'
    },
    RATING_HIGH: {
      label: 'Highest Rating',
      value: 'rating_high',
      field: 'rating',
      order: 'desc'
    },
    RATING_LOW: {
      label: 'Lowest Rating',
      value: 'rating_low',
      field: 'rating',
      order: 'asc'
    }
  };
  
  // Filter Options
  export const FILTER_OPTIONS = {
    ALL: 'all',
    HIGH_RATED: 'high_rated', // 4-5 stars
    MID_RATED: 'mid_rated',   // 3 stars
    LOW_RATED: 'low_rated',   // 1-2 stars
    WITH_IMAGES: 'with_images',
    WITHOUT_IMAGES: 'without_images'
  };
  
  // Pagination
  export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 9,
    PAGE_SIZE_OPTIONS: [9, 18, 27, 36],
    MAX_PAGES_SHOWN: 5
  };
  
  // Local Storage Keys
  export const STORAGE_KEYS = {
    DRAFT_REVIEW: 'draft_review',
    USER_PREFERENCES: 'user_preferences',
    LAST_SEARCH: 'last_search',
    VIEW_MODE: 'view_mode'
  };
  
  // View Modes
  export const VIEW_MODES = {
    GRID: 'grid',
    LIST: 'list',
    COMPACT: 'compact'
  };
  
  // Chart Options
  export const CHART_OPTIONS = {
    RATING: {
      type: 'bar',
      aspectRatio: 2,
      plugins: {
        legend: {
          display: false
        }
      }
    },
    DEMOGRAPHICS: {
      type: 'pie',
      aspectRatio: 1,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  };
  
  // Date Format Options
  export const DATE_FORMAT_OPTIONS = {
    FULL: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
    SHORT: {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    },
    RELATIVE: {
      style: 'relative',
      numeric: 'auto',
      maximumFractionDigits: 0
    }
  };