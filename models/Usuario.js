const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome:{
        type: String,
        required:true
    },
    email:{
        type:String,
        require:true
    },
    senha:{
        type:String,
        require:true
    }
})

mongoose.model("usuarios", Usuario)