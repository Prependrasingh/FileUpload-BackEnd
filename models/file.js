const mongoose = require("mongoose");
require("dotenv").config();

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    }

});

const File = mongoose.model("File" , fileSchema);
module.exports = File;