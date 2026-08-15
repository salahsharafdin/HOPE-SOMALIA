const fs = require('fs');
const path = require('path');

// Storage abstraction interface designed for local disk, Cloudinary, or AWS S3
class StorageService {
  constructor() {
    this.uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file, folder = 'General') {
    // Generate clean unique filename
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const targetFolderDir = path.join(this.uploadDir, folder);
    
    if (!fs.existsSync(targetFolderDir)) {
      fs.mkdirSync(targetFolderDir, { recursive: true });
    }

    const filePath = path.join(targetFolderDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    const publicUrl = `/uploads/${folder}/${filename}`;
    return {
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: publicUrl,
      folder,
    };
  }

  async deleteFile(publicUrl) {
    if (!publicUrl || !publicUrl.startsWith('/uploads/')) return false;
    const relativePath = publicUrl.replace('/uploads/', '');
    const fullPath = path.join(this.uploadDir, relativePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  }
}

module.exports = new StorageService();
