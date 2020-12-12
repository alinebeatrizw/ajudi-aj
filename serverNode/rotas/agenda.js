const express = require("express")//express
const router = express.Router()//colocando a função de rotas do express dentro da constante
const mongoose = require("mongoose")//mongoose
require("../models/Cliente")//model de cliente
const Cliente = mongoose.model("clientes")//colocando o model dentro da costante
require("../models/Processo")
require("../models/Evento")
const Evento = mongoose.model("eventos")//colocando o model dentro da costante

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
  

//cadastra no banco
//falta conseguir pegar o valor do select do estado
router.post("/novo-evento", (req,res)=>{
  const novoEvento = {
      nomeEvento: req.body.nomeEvento,
      dataInicio:req.body.dataInicio,
      dataFim:req.body.dataFim,
      descricaoEvento:req.body.descricaoEvento,
      cor:req.body.cor
  }
  new Evento(novoEvento).save().then(()=>{
      req.flash("success_msg", "Evento salvo com sucesso")
      res.redirect("/agenda")
  }).catch((err)=>{
      req.flash("error_msg", "Erro ao salvar evento")
      res.redirect("/agenda")
  })
})



  
  
  //exportando as rotas
  module.exports = router