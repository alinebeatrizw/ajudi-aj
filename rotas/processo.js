const express = require("express")//express
const router = express.Router()//colocando a função de rotas do express dentro da constante
const mongoose = require("mongoose")//mongoose
require("../models/Cliente")//model de cliente
const Cliente = mongoose.model("clientes")//colocando o model dentro da costante
require("../models/Processo")
const Processo = mongoose.model("processos")


//mostra os processos
router.get("/",(req,res)=>{
    Processo.find().lean().populate("cliente").sort({data:"desc"}).then((processos)=>{
        res.render("processo/processos", {processos:processos})
    }).catch((err)=>{
        req.flash("error_msg","Erro ao listar os processos")
        res.redirect("/")
    })
  })
  
  
  router.get("/add", (req,res)=>{
    Cliente.find().lean().then((clientes)=>{
        res.render("processo/addProcessos",{clientes:clientes})
    }).catch((err)=>{
        req.flash("error_msg", "Ocorreu um erro")
        res.redirect("/processos")
    })
    
  })
  
  router.post("/novo", (req,res)=>{
        const novoProcesso = {
          numeroProcesso: req.body.numeroProcesso,
          comarca: req.body.comarca,
          vara: req.body.vara,
          dataPropositura: req.body.dataPropositura,
          valorCausa: req.body.valorCausa,
          honorarios: req.body.honorarios,
          descricao: req.body.descricao,
          cliente: req.body.cliente
        }
        new Processo(novoProcesso).save().then(()=>{
            req.flash("success_msg", "Processo salvo com sucesso")
            res.redirect("/processo")
        }).catch((err)=>{
            req.flash("error_msg", "Erro ao salvar")
            res.redirect("/processo")
        })
    
  })
  //apaga processo
  router.post("/deletar",(req,res)=>{
    Processo.remove({_id:req.body.id}).then(()=>{
        req.flash("success_msg", "Processo apagado com sucesso")
        res.redirect("/processo")
    }).catch((err)=>{
        req.flash("error_msg", "Ocorreu um erro ao apagar")
        res.redirect("/processo")
    })
  })
  
  //edita o processo
  router.post("/editar",(req, res)=>{
    Processo.findOne({_id: req.body.id}).then((processos)=>{
        processos.numeroProcesso= req.body.numeroProcesso,
        processos.comarca=req.body.comarca,
        processos.vara=req.body.vara,
        processos.dataPropositura=req.body.dataPropositura,
        processos.valorCausa=req.body.valorCausa,
        processos.honorarios=req.body.honorarios,
        processos.descricao=req.body.descricao,
        
  
  
        processos.save().then(()=>{
            req.flash("success_msg", "Processo editado com sucesso")
            res.redirect("/processo")
            }).catch((err)=>{
                req.flash("error_msg", "Ocorreu um erro interno ao salvar a edição")
                res.redirect("/processo")
            })
        }).catch((err)=>{
            req.flash("error_msg", "Ocorreu um erro ao editar o processo")
            res.redirect("/processo")
        })
  }) 
    
  //rota para a pagina do formulario de edição
  router.get("/editar/:id",(req,res)=>{
    Processo.findOne({_id:req.params.id}).lean().then((processos)=>{
        res.render("processo/editProcesso", {processos:processos})
    })
  })
  //exportando as rotas
module.exports = router
  