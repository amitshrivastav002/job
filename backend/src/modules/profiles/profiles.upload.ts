import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { randomUUID } from 'crypto';

export const PHOTO_UPLOAD_DIR = path.resolve(process.cwd(), 'uploads', 'photos');
fs.mkdirSync(PHOTO_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, PHOTO_UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const photoUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(new Error('Only JPEG, PNG, or WEBP images are allowed'));
      return;
    }
    cb(null, true);
  },
});
