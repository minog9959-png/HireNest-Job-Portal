// Cloudinary config: CV PDF yahan upload hota hai, database me sirf us ka link save hota hai.
// 3 env vars zaroori hain: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
// Ye values kabhi code ya GitHub me nahi likhni, sirf .env / Vercel Environment Variables me.
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

// Buffer (memory me aayi hui file) ko Cloudinary par upload karna.
// PDF ke liye resource_type 'raw' hota hai, folder 'hirenest-cvs' hai.
function uploadPdfBuffer(buffer, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'hirenest-cvs', public_id: publicId },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

module.exports = { cloudinary, isConfigured, uploadPdfBuffer };
