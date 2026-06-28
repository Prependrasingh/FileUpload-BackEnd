# File Upload App — Backend

A Node.js backend for uploading **images, PDFs, and videos** to **Cloudinary**, with support for local file storage, file-type validation, image resizing, and automatic email notification on upload.

## Features

- Upload images (jpg, jpeg, png, pdf) to Cloudinary
- Upload videos (mp4, mov, avi, webm) to Cloudinary
- Resize/compress images on upload
- Save files locally (without Cloudinary)
- File type validation before upload
- File metadata (name, email, tags, URL) stored in MongoDB
- **Automatic email notification** sent to the uploader once a file is saved, containing a link to the uploaded file

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **File Handling:** express-fileupload
- **Cloud Storage:** Cloudinary
- **Email:** Nodemailer

## Project Structure

```
fileupload-app/
├── config/
│   ├── database.js          # MongoDB connection
│   └── cloudinary.js        # Cloudinary connection config
├── models/
│   └── file.js               # File schema + post-save email hook
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

MAIL_HOST=smtp.your-provider.com
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_app_password
```

> Get your Cloudinary credentials from the [Cloudinary Dashboard](https://cloudinary.com/console).
>
> For `MAIL_USER`/`MAIL_PASS`, use an **app password** if you're using Gmail or another provider with 2FA enabled — not your regular login password.

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
| POST   | `/local`     | Upload a file to local server storage       | `file`                                     |
| POST   | `/image`     | Upload an image/PDF to Cloudinary           | `imageFile`, `name`, `email`, `tags`       |
| POST   | `/video`     | Upload a video to Cloudinary                | `videoFile`, `name`, `email`, `tags`       |
| POST   | `/resize`    | Upload + compress an image to Cloudinary    | `imageFile`, `name`, `email`, `tags`       |

### Supported File Types

| Type   | Extensions                     |
|--------|----------------------------------|
| Image  | `jpg`, `jpeg`, `png`, `pdf`       |
| Video  | `mp4`, `mov`, `avi`, `webm`       |

### Upload Image

**POST** `/api/v1/upload/image`

Send as `multipart/form-data`:

| Field       | Type   | Required |
|-------------|--------|----------|
| `imageFile` | File   | Yes      |
| `name`      | Text   | Yes      |
| `email`     | Text   | Yes — used to send the upload confirmation email |
| `tags`      | Text   | No       |

**Response**

```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/.../MyData/abc123.jpg",
  "message": "Data uploaded successfully on cloudinary"
}
```

Once the file record is saved to MongoDB, an email is automatically sent to the provided `email` address with a clickable link to the uploaded file.

### Upload Video

**POST** `/api/v1/upload/video`

Send as `multipart/form-data`:

| Field       | Type   | Required |
|-------------|--------|----------|
| `videoFile` | File   | Yes      |
| `name`      | Text   | Yes      |
| `email`     | Text   | Yes — used to send the upload confirmation email |
| `tags`      | Text   | No       |

**Response**

```json
{
  "success": true,
  "message": "video uploaded successfully"
}
```

### Resize + Upload Image

**POST** `/api/v1/upload/resize`

Same fields as `/image`, but compresses the image before storing on Cloudinary — useful for reducing file size for thumbnails or previews. Triggers the same email notification on save.

### Upload Locally (no Cloudinary)

**POST** `/api/v1/upload/local`

Send as `multipart/form-data`:

| Field  | Type | Required |
|--------|------|----------|
| `file` | File | Yes      |

Saves the file directly into the server's local `/files` directory instead of Cloudinary. This route does **not** trigger an email, since it bypasses the `File` model entirely.

## Email Notifications

The `File` model defines a Mongoose **post-save hook** that fires automatically every time a file record is created:

```js
fileSchema.post("save", async function (doc) {
  // sends an email to doc.email with a link to doc.imageUrl
});
```

This means **any** route that calls `File.create(...)` (i.e. `/image`, `/video`, `/resize`) will automatically trigger an email to the address provided in the upload request — no extra code needed in the controllers.

Emails are sent via **Nodemailer** using SMTP credentials from your `.env` file, and include a direct link to the uploaded file on Cloudinary.

## Environment Variables Reference

| Variable        | Description                            |
|------------------|-------------------------------------------|
| `PORT`           | Port the server runs on                    |
| `DATABASE_URL`   | MongoDB connection string                  |
| `CLOUD_NAME`     | Cloudinary cloud name                      |
| `API_KEY`        | Cloudinary API key                         |
| `API_SECRET`     | Cloudinary API secret                      |
| `MAIL_HOST`      | SMTP host used to send notification emails |
| `MAIL_USER`      | Email account used to send mail            |
| `MAIL_PASS`      | App password for the email account         |

## Notes

- Cloudinary's free tier may restrict raw/PDF file delivery by default — enable **"Allow delivery of PDF and ZIP files"** under **Settings → Security** in your Cloudinary dashboard if PDF uploads fail.
- Image resizing uses Cloudinary's `quality` transformation; for actual dimension resizing, `width`/`height` parameters can also be passed.
- The email notification hook runs on **every** successful `File.create(...)` call — if you don't want an email sent for a particular upload type, handle that file differently (e.g. via the local upload route, which skips the `File` model).

## License

This project is open source and available for personal and educational use.
