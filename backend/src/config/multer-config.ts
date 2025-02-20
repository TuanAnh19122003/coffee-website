import * as multer from 'multer';

export const multerConfig = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
      const now = new Date();
      const timestamp = now
        .toISOString()
        .replace(/T/, '_')
        .replace(/\..+/, '')
        .replace(/:/g, '-');

      let baseName = file.originalname;
      let name = baseName
        .replace(/[^0-9a-zA-Z-\s.]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      const newFileName = `${timestamp}-${name}`;
      cb(null, newFileName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpeg|jpg|png)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
};
