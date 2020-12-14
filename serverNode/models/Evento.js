const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const Evento = new Schema({
    nomeEvento:{
        type: String,
        required:true
    },
    dataInicio:{
        type:String,
        require:true
    },
    horaEvento:{
        type:String,
        require:true
    }
    
    
})

mongoose.model("eventos", Evento)