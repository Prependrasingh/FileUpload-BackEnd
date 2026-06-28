const mongoose = require("mongoose");
require("dotenv").config();
const nodemailer = require("nodemailer");

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  tags: {
    type: String,
  },
  email: {
    type: String,
  },
});

// post Middleware
fileSchema.post("save", async function (doc) {
  try {
    console.log("doc->", doc);

    // transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: `prependraEnterprises`,
      to: doc.email,
      subject: "verification mail",
      html: `<h2>Hello Jii</h2> File uploaded view here <a href = ${doc.imageUrl}>${doc.imageUrl}</a>`,
    });
    console.log("INFO->", info);
  } catch (error) {
    console.error(error);
  }
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
