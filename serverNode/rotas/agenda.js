const express = require("express")//express
const router = express.Router()//colocando a função de rotas do express dentro da constante
const mongoose = require("mongoose")//mongoose
require("../models/Cliente")//model de cliente
const Cliente = mongoose.model("clientes")//colocando o model dentro da costante
require("../models/Processo")
const Processo = mongoose.model("processos")
const multer = require("multer");
const OAuth2Data = require("../credentials.json");
var name,pic
const { google } = require("googleapis");
var async = require("async");
const fs = require("fs");


router.get("/", (req,res)=>{
    res.render("agenda/agenda")
  })
  
  
  
  //exportando as rotas
  module.exports = router