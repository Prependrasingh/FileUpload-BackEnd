const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

const fileupload = require("express-fileupload");
app.use(fileupload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));


const port = process.env.PORT || 5000;

const db = require("./config/database");
db.connect();
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

const upload = require("./routes/fileupload");
app.use("/api/v1/upload" , upload);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.listen(port , ()=>{
    console.log(`server started at port ${port}`);
})