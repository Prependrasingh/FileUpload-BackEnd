# File Upload App — Backend

A Node.js backend for uploading **images, PDFs, and videos** to **Cloudinary**, with support for local file storage, file-type validation, and image resizing.

## Features

- Upload images (jpg, jpeg, png, pdf) to Cloudinary
- Upload videos (mp4, mov, avi, webm) to Cloudinary
- Resize/compress images on upload
- Save files locally (without Cloudinary)
- File type validation before upload
- File metadata (name, email, tags, URL) stored in MongoDB

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **File Handling:** express-fileupload
- **Cloud Storage:** Cloudinary

## Project Structure

```
fileupload-app/
├── config/
│   ├── database.js          # MongoDB connection
│   └── cloudinary.js        # Cloudinary connection config
├── models/
│   └── file.js               # File schema
├── controllers/
│   └── FileUpload.js         # Upload logic (image/video/local/resize)
├── routes/
│   └── fileupload.js         # Upload routes
├── .env                       # Environment variables (not committed)
├── .gitignore
├── package.json
└── index.js                   # App entry point
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd fileupload-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
DATABASE_URL=your_mongodb_connection_string

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

> Get your Cloudinary credentials from the [Cloudinary Dashboard](https://cloudinary.com/console).

### 4. Run the server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

The server will start at `http://localhost:5000`.

## API Endpoints

Base URL: `/api/v1/upload`

| Method | Endpoint     | Description                                | Body (form-data)                          |
|--------|--------------|---------------------------------------------|--------------------------------------------|
| POST   | `/localFileUpload`     | Upload a file to local server storage       | `file`                                     |
| POST   | `/imageUpload`     | Upload an image/PDF to Cloudinary           | `imageFile`, `name`, `email`, `tags`       |
| POST   | `/videoUpload`     | Upload a video to Cloudinary                | `videoFile`, `name`, `email`, `tags`       |
| POST   | `/imageResizeUpload`    | Upload + compress an image to Cloudinary    | `imageFile`, `name`, `email`, `tags`       |

### Supported File Types

| Type   | Extensions                     |
|--------|----------------------------------|
| Image  | `jpg`, `jpeg`, `png`, `pdf`       |
| Video  | `mp4`, `mov`, `avi`, `webm`       |

### Upload Image

**POST** `/api/v1/upload/imageUpload`

Send as `multipart/form-data`:

| Field       | Type   | Required |
|-------------|--------|----------|
| `imageFile` | File   | Yes      |
| `name`      | Text   | Yes      |
| `email`     | Text   | Yes      |
| `tags`      | Text   | No       |

**Response**

```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/.../MyData/abc123.jpg",
  "message": "Data uploaded successfully on cloudinary"
}
```

### Upload Video

**POST** `/api/v1/upload/videoUpload`

Send as `multipart/form-data`:

| Field       | Type   | Required |
|-------------|--------|----------|
| `videoFile` | File   | Yes      |
| `name`      | Text   | Yes      |
| `email`     | Text   | Yes      |
| `tags`      | Text   | No       |

**Response**

```json
{
  "success": true,
  "message": "video uploaded successfully"
}
```

### Resize + Upload Image

**POST** `/api/v1/upload/imageResizeUpload`

Same fields as `/image`, but compresses the image (quality reduced) before storing on Cloudinary — useful for reducing file size for thumbnails or previews.

### Upload Locally (no Cloudinary)

**POST** `/api/v1/upload/localFileUpload`

Send as `multipart/form-data`:

| Field  | Type | Required |
|--------|------|----------|
| `file` | File | Yes      |

Saves the file directly into the server's local `/files` directory instead of Cloudinary.

## Environment Variables Reference

| Variable        | Description                          |
|------------------|----------------------------------------|
| `PORT`           | Port the server runs on                |
| `DATABASE_URL`   | MongoDB connection string              |
| `CLOUD_NAME`     | Cloudinary cloud name                  |
| `API_KEY`        | Cloudinary API key                     |
| `API_SECRET`     | Cloudinary API secret                  |

## Notes

- Cloudinary's free tier may restrict raw/PDF file delivery by default — enable **"Allow delivery of PDF and ZIP files"** under **Settings → Security** in your Cloudinary dashboard if PDF uploads fail.
- Image resizing uses Cloudinary's `quality` transformation; for actual dimension resizing, `width`/`height` parameters can also be passed.

## License

This project is open source and available for personal and educational use.
