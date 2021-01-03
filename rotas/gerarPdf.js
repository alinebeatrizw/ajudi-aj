const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Evento")
const Evento = mongoose.model("eventos")

router.post("/gerar", (req,res)=>{
    Evento.find().lean().sort({data:"desc"}).then((eventos)=>{
        res.render("agenda/pdf", {eventos:eventos})
    }).catch((err)=>{
        req.flash("error_msg","Erro ao listar os clientes")
        res.redirect("/")
    })   
  })
     
module.exports = router;