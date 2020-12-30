const express = require("express")//express
const router = express.Router()//colocando a função de rotas do express dentro da constante
const mongoose = require("mongoose")//mongoose
require("../models/Processo")
require("../models/Evento")
const Evento = mongoose.model("eventos")//colocando o model dentro da costante

  
//mostra os eventos
router.get("/",(req,res)=>{
  Evento.find().lean().then((eventos)=>{
      res.render("agenda/agenda", {eventos:eventos})
  }).catch((err)=>{
      req.flash("error_msg","Erro ao listar os clientes")
      res.redirect("/")
  })
})


//gerar pdf
router.post("/gerar", (req,res)=>{
    Evento.find().lean().then((eventos)=>{
        res.render("agenda/pdf", {eventos:eventos})
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

//edita o evento
router.post("/editar",(req, res)=>{
  Evento.findOne({_id: req.body.id}).then((eventos)=>{
      eventos.nomeEvento= req.body.nomeEvento,
      eventos.dataInicio=req.body.dataInicio,
      eventos.horaEvento=req.body.horaEvento,

      eventos.save().then(()=>{
          req.flash("success_msg", "Evento editado com sucesso")
          res.redirect("/agenda")
          }).catch((err)=>{
              req.flash("error_msg", "Ocorreu um erro interno ao salvar a edição do evento")
              res.redirect("/agenda")
          })
      }).catch((err)=>{
          req.flash("error_msg", "Ocorreu um erro ao editar o evento")
          res.redirect("/agenda")
      })
}) 
  
//rota para a pagina do formulario de edição
router.get("/editar/:id",(req,res)=>{
  Evento.findOne({_id:req.params.id}).lean().then((eventos)=>{
      res.render("agenda/editAgenda", {eventos:eventos})
  })
})
  
  //exportando as rotas
module.exports = router