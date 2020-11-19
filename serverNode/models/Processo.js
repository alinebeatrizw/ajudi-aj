const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const Processo = new Schema({
    numeroProcesso:{
        type: String,
        required:true
    },
    comarca:{
        type:String,
        require:true
    },
    vara:{
        type:String,
        require:true
    },
    dataPropositura:{
        type:String,
        require:true
    },
    cliente:{
        type:Schema.Types.ObjectId, //a categoria vai armazenar o id de algum objeto
        ref:"clientes", // armazena o id de uma categoria
        require:true
    },
    valorCausa:{
        type: String,
        require:true
    },
    honorarios:{
        type: String,
        require:true
    },
    descricao:{
        type: String,
        require:true
    },
})

mongoose.model("processos", Processo)