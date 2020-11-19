const mongoose = require("mongoose")
const Schema = mongoose.Schema


//criando o schema no mongodb 
//mesma coisa que fazer create table
const Cliente = new Schema({
    nome:{
        type: String,
        required: true
    },
    sobrenome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    telefone:{
        type: String,
    },
    nomeMae:{
        type: String,
        required: true
    },
    dataNascimento:{
        type: Date,
        required: true
    },
    selectEstadoCivil:{
        type: String,
        required: true
    },
    naturalidade:{
        type: String,
        required: true
    },
    nacionalidade:{
        type: String,
        required: true
    },
    endereco:{
        type: String,
        required: true
    },
    cidade:{
        type: String,
        required: true
    },
    selectEstado:{
        type: String,
        required: true
    },
    cep:{
        type: String,
        required: true
    },
    rg:{
        type: String,
        required: true
    },
    cpf:{
        type: String,
        required: true
    },
    cnh:{
        type: String,
        required: true
    },
    ctps:{
        type: String,
        required: true
    },
    processo:{
        type:String,
    },
    processo2:{
        type:String,
    },
    processo3:{
        type:String,
    },
    processo4:{
        type:String,
    }


})


//o nome da collection para a schema Cliente fica clientes
mongoose.model("clientes", Cliente)