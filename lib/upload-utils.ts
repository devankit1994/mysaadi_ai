import { supabase } from "@/lib/supabase";

export const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024; // 1MB

/**
 * Validates if the given file is an image and within the size limit.
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!file.type.startsWith("image/")) {
    return { isValid: false, error: "Please select an image file" };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { isValid: false, error: "File size should be less than or equal to 1MB" };
  }

  return { isValid: true };
}

/**
 * Uploads a photo to the Supabase "photos" bucket.
 * @param file The file to upload.
 * @param folderId The ID of the user or entity to organize the file under.
 * @returns The public URL of the uploaded photo.
 */
export async function uploadPhotoToSupabase(file: File, folderId: string): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${folderId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(fileName);
  return publicUrl;
}

/**
 * Sets up a window focus listener to detect when the file picker is closed without selecting a file.
 * @param onCancel Callback to run when the file picker is dismissed.
 */
export function setupFilePickerFocusListener(onCancel: () => void) {
  const handleFocus = () => {
    setTimeout(() => {
      onCancel();
      window.removeEventListener('focus', handleFocus);
    }, 300);
  };
  
  window.addEventListener('focus', handleFocus);
}
