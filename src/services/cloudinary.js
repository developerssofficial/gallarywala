/**
 * Cloudinary Upload Service
 * Handles direct unsigned uploads to Cloudinary REST API.
 */

export const uploadToCloudinary = async (file, { cloudName, uploadPreset, onProgress }) => {
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary Cloud Name and Upload Preset are required. Please configure them in Settings.");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset.trim());

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.secure_url,
            publicId: response.public_id,
            width: response.width,
            height: response.height,
            format: response.format,
            bytes: response.bytes
          });
        } catch (err) {
          reject(new Error("Failed to parse Cloudinary response."));
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          reject(new Error(errorResponse.error?.message || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during Cloudinary upload. Please check your internet connection and Cloudinary settings."));
    };

    xhr.send(formData);
  });
};

/**
 * Fallback local file reader when testing without Cloudinary credentials
 */
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
