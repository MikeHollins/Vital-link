import { Request, Response, NextFunction } from 'express';
import path from 'path';

// Secure file upload validation
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'application/pdf',
    'text/csv',
    'application/json'
  ];
  
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.csv', '.json'];
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const maxFiles = 10;

  if (req.files) {
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    
    if (files.length > maxFiles) {
      return res.status(400).json({ error: 'Too many files. Maximum 10 files allowed.' });
    }

    for (const file of files) {
      // Check file size
      if (file.size > maxFileSize) {
        return res.status(400).json({ 
          error: `File "${file.name}" is too large. Maximum size is 5MB.` 
        });
      }

      // Check MIME type
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({ 
          error: `File type "${file.mimetype}" is not allowed.` 
        });
      }

      // Check file extension
      const ext = path.extname(file.name).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        return res.status(400).json({ 
          error: `File extension "${ext}" is not allowed.` 
        });
      }

      // Check for dangerous file names
      if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
        return res.status(400).json({ 
          error: 'Invalid file name.' 
        });
      }
    }
  }

  if (req.file) {
    const file = req.file;
    
    if (file.size > maxFileSize) {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: 'File type not allowed.' });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ error: 'File extension not allowed.' });
    }
  }

  next();
};