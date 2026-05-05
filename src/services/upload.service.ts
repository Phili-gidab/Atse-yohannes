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

// ---------- Cloudinary implementation (stub for later) ----------
// When we migrate, fill this in with an unsigned upload preset POST to
// https://api.cloudinary.com/v1_1/{cloud_name}/{auto|raw}/upload
// and switch getUploader() below.

const cloudinaryUploader: Uploader = {
  async upload() {
    throw new Error('Cloudinary uploader not implemented yet — set up Cloudinary first.');
  },
  async remove() {
    throw new Error('Cloudinary uploader not implemented yet.');
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
