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



  
//mostra os eventos
router.get("/",(req,res)=>{
  Evento.find().lean().then((eventos)=>{
      res.render("agenda/agenda", {eventos:eventos})
  }).catch((err)=>{
      req.flash("error_msg","Erro ao listar os clientes")
      res.redirect("/")
  })
})

//cadastra no banco
router.post("/novo-evento", (req,res)=>{
  const novoEvento = {
      nomeEvento: req.body.nomeEvento,
      dataInicio:req.body.dataInicio,
      horaEvento:req.body.horaEvento
  }
  new Evento(novoEvento).save().then(()=>{
      req.flash("success_msg", "Evento salvo com sucesso")
      res.redirect("/agenda")
  }).catch((err)=>{
      req.flash("error_msg", "Erro ao salvar evento")
      res.redirect("/agenda")
  })
})

//apaga evento
router.post("/deletar",(req,res)=>{
  Evento.remove({_id:req.body.id}).then(()=>{
      req.flash("success_msg", "Evento apagado com sucesso")
      res.redirect("/agenda")
  }).catch((err)=>{
      req.flash("error_msg", "Ocorreu um erro ao apagar o evento")
      res.redirect("/agenda")
  })
})


  
  //exportando as rotas
  module.exports = router