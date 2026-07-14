// Simple client-side queue service using localStorage to persist queued photos
const QUEUE_KEY = "roadside_photo_upload_queue";
const SETTINGS_KEY = "roadside_upload_settings";

export const getQueue = () => {
  try {
    const data = localStorage.getItem(QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveQueue = (queue) => {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error("Failed to save queue to localStorage", e);
  }
};

export const addToQueue = (file, claimId) => {
  const queue = getQueue();
  const newEntry = {
    id: Math.random().toString(36).substring(2, 9),
    name: file.name,
    size: file.size,
    claimId: claimId,
    status: "pending", // pending, uploading, failed, complete
    progress: 0,
    addedAt: new Date().toISOString(),
    // Store base64 representation of the file for offline persistence
    base64: null,
  };

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      newEntry.base64 = reader.result;
      queue.push(newEntry);
      saveQueue(queue);
      resolve(newEntry);
    };
    reader.readAsDataURL(file);
  });
};

export const removeFromQueue = (id) => {
  const queue = getQueue();
  const filtered = queue.filter((item) => item.id !== id);
  saveQueue(filtered);
};

export const updateQueueItem = (id, updates) => {
  const queue = getQueue();
  const updated = queue.map((item) => {
    if (item.id === id) {
      return { ...item, ...updates };
    }
    return item;
  });
  saveQueue(updated);
};

export const getUploadSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : { uploadOverCellular: false };
  } catch (e) {
    return { uploadOverCellular: false };
  }
};

export const saveUploadSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save settings to localStorage", e);
  }
};

// Helper to convert base64 back to File object for uploading
export const base64ToFile = (base64String, filename) => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
