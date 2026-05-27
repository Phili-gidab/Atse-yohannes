// Upload abstraction. Today: Firebase Storage. Tomorrow: Cloudinary.
// Swap is a one-line change in `getUploader()` — call sites stay identical.
//
// Path conventions (match storage.rules):
//   site/...               public site assets
//   projects/{slug}/...    project images
//   news/{slug}/...        news cover + body images
//   events/{id}/{file}     event galleries
//   resources/public/...   publicly downloadable
//   resources/members/...  member-only (Storage rule enforces)
//   users/{uid}/...        per-user uploads (only owner can write)

import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../config/firebase';

export interface UploadResult {
  url: string;
  path: string;
  contentType: string;
  size: number;
}

export interface UploadOptions {
  /** Folder path relative to bucket root, e.g. "projects/lmc". No leading slash. */
  folder: string;
  /** Optional override for the stored filename. Defaults to a timestamp + sanitized original name. */
  filename?: string;
  /** Progress callback in 0–100. */
  onProgress?: (pct: number) => void;
  /** Abort signal for cancellation. */
  signal?: AbortSignal;
}

export interface Uploader {
  upload(file: File, opts: UploadOptions): Promise<UploadResult>;
  remove(path: string): Promise<void>;
}

// ---------- Firebase Storage implementation ----------

const sanitizeFilename = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);

const firebaseUploader: Uploader = {
  async upload(file, { folder, filename, onProgress, signal }) {
    if (!storage) throw new Error('Storage not configured');

    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    const finalName = filename ?? `${Date.now()}-${sanitizeFilename(file.name)}`;
    const fullPath = `${cleanFolder}/${finalName}`;
    const ref = storageRef(storage, fullPath);

    const task = uploadBytesResumable(ref, file, { contentType: file.type });

    if (signal) {
      const onAbort = () => task.cancel();
      signal.addEventListener('abort', onAbort, { once: true });
    }

    return new Promise<UploadResult>((resolve, reject) => {
      task.on(
        'state_changed',
        (snap) => {
          if (onProgress && snap.totalBytes > 0) {
            onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
          }
        },
        (err) => reject(err),
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            resolve({
              url,
              path: fullPath,
              contentType: task.snapshot.metadata.contentType ?? file.type,
              size: task.snapshot.totalBytes,
            });
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  },

  async remove(path) {
    if (!storage) throw new Error('Storage not configured');
    await deleteObject(storageRef(storage, path));
  },
};

// ---------- Cloudinary implementation ----------
// Unsigned upload preset flow: the browser POSTs the file directly to
// Cloudinary with a preset name. No API secret leaves the server. The preset
// must be created in the Cloudinary console with Signing Mode = Unsigned.
//
// Required env vars:
//   VITE_UPLOAD_PROVIDER=cloudinary
//   VITE_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
//   VITE_CLOUDINARY_UPLOAD_PRESET=<your-unsigned-preset>
//
// Deletion via unsigned uploads is not supported (it requires a signed
// server-side call). `remove()` therefore throws — but nothing in the app
// calls it today, so this is fine.

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  bytes: number;
  resource_type: string;
  format: string;
  error?: { message: string };
}

const cloudinaryUploader: Uploader = {
  async upload(file, { folder, onProgress, signal }) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;
    if (!cloudName || !preset) {
      throw new Error(
        'Cloudinary not configured — set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'
      );
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', preset);
    // Cloudinary expects a forward-slash folder path. Strip leading/trailing
    // slashes the same way the Firebase impl does so call sites can pass
    // either "events" or "events/" without issues.
    const cleanFolder = folder.replace(/^\/+|\/+$/g, '');
    if (cleanFolder) form.append('folder', cleanFolder);

    return new Promise<UploadResult>((resolve, reject) => {
      // fetch() can't report upload progress on the browser today, so we use
      // XHR purely to get a live percentage into the admin UI.
      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint);

      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable && e.total > 0) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
      }

      if (signal) {
        const onAbort = () => xhr.abort();
        signal.addEventListener('abort', onAbort, { once: true });
      }

      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText) as CloudinaryResponse;
          if (xhr.status >= 200 && xhr.status < 300 && json.secure_url) {
            resolve({
              url: json.secure_url,
              path: json.public_id,
              contentType: file.type || `${json.resource_type}/${json.format}`,
              size: json.bytes ?? file.size,
            });
          } else {
            reject(new Error(json.error?.message ?? `Cloudinary upload failed (HTTP ${xhr.status})`));
          }
        } catch (err) {
          reject(new Error(`Cloudinary returned invalid JSON: ${(err as Error).message}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during Cloudinary upload'));
      xhr.onabort = () => reject(new Error('Upload aborted'));

      xhr.send(form);
    });
  },

  async remove() {
    // Unsigned uploads can't delete — this would require an API secret which
    // must live server-side. If we ever need deletion we'll add a Cloud
    // Function that calls Cloudinary's destroy API with the signed secret.
    throw new Error(
      'Cloudinary delete is not supported from the browser. Remove the asset in the Cloudinary console.'
    );
  },
};

// ---------- Selection ----------

export type UploadProvider = 'firebase' | 'cloudinary';

export const getUploader = (): Uploader => {
  const provider =
    (import.meta.env.VITE_UPLOAD_PROVIDER as UploadProvider | undefined) ?? 'firebase';

  if (provider === 'cloudinary') return cloudinaryUploader;
  if (!isFirebaseConfigured) {
    throw new Error('No upload provider available — configure Firebase or set VITE_UPLOAD_PROVIDER=cloudinary');
  }
  return firebaseUploader;
};

// Convenience singleton for call sites that don't care about lifecycle.
export const uploader = {
  upload: (file: File, opts: UploadOptions) => getUploader().upload(file, opts),
  remove: (path: string) => getUploader().remove(path),
};
