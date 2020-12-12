const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const Evento = new Schema({
    nomeEvento:{
        type: String,
        required:true
    },
    dataInicio:{
        type:Date,
        require:true
    },
    dataFim:{
        type:Date,
        require:true
    },
    descricaoEvento:{
        type:String,
        require:true
    },
    cor:{
        type: String,
        require:true
    }
    
    
})

mongoose.model("eventos", Evento)