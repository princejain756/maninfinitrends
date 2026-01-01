# Image Upload Feature

## Overview
The admin panel now supports uploading images directly to the server, in addition to using external URLs.

## Features Added

### Server-side (Backend)
1. **Multer Integration**: Added multer middleware for handling multipart/form-data uploads
2. **Upload Endpoint**: `/api/admin/upload-images` - accepts multiple image files
3. **File Validation**: 
   - File type validation (JPEG, JPG, PNG, GIF, WEBP)
   - File size limit (5MB per file)
   - Maximum 10 files per request
4. **Storage**: Images are stored in `server/public/uploads/` directory
5. **Static File Serving**: Uploaded images are served at `/uploads/<filename>`

### Frontend (Admin Panel)
1. **ImageUploader Component**: New reusable component for image uploads
   - Drag and drop functionality
   - File selection via button
   - Image preview grid with delete option
   - Upload progress indication
   - Error handling
   - Maximum image limit (configurable)

2. **Enhanced AddProduct Page**: 
   - Image upload section with visual feedback
   - Optional additional URLs input
   - Combines uploaded images with URL images
   - Improved user experience

## Usage

### For Admins
1. Navigate to the Add Product page
2. Use the "Product Images" section to:
   - Click "Choose files" to select images from your computer
   - Or drag and drop images directly onto the upload area
3. Preview uploaded images and remove any unwanted ones
4. Optionally add additional image URLs in the separate input field
5. Submit the form - all images (uploaded + URLs) will be associated with the product

### Technical Details
- **Upload Endpoint**: `POST /api/admin/upload-images`
- **Response Format**: `{ success: true, urls: ["url1", "url2", ...] }`
- **File Storage**: `server/public/uploads/`
- **URL Format**: `https://yourdomain.com/uploads/filename.jpg`

## File Structure
```
server/
├── public/
│   └── uploads/          # Uploaded images stored here
├── src/
│   └── routes/
│       └── admin.ts      # Upload endpoint implementation
└── ...

src/
├── components/
│   └── ImageUploader.tsx # Reusable image upload component
├── pages/
│   └── Admin/
│       └── AddProduct.tsx # Enhanced with image upload
└── ...
```

## Configuration
- **File size limit**: 5MB per file (configurable in `admin.ts`)
- **File types**: JPEG, JPG, PNG, GIF, WEBP (configurable in `admin.ts`)
- **Max files per upload**: 10 files (configurable in `admin.ts`)
- **Max images per product**: 8 images (configurable in `ImageUploader` component)

## Security Notes
- All uploads are validated for file type and size
- Only admin users can access the upload endpoint
- Files are stored outside the web root initially, then served via Express static middleware
- Original filenames are replaced with unique identifiers to prevent conflicts