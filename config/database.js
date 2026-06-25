const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.DATABASE_URL , {
    })
    .then(console.log("DB CONNECTED SUCCESSFULLY"))
    .catch((error) => {
        console.log("DB connection Error")
        console.error(error);
        process.exit(1);
    });
};