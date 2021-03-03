const express = require("express")//express
const router = express.Router()//colocando a função de rotas do express dentro da constante
const mongoose = require("mongoose")//mongoose
require("../models/Cliente")//model de cliente
const Cliente = mongoose.model("clientes")//colocando o model dentro da costante
require("../models/Processo")

//para somente admins poderem apagar clientes
const {eAdmin} = require("../helpers/eAdmin") //as chaves pegam somente a função eAdmin do helper e guarda na variavel de eAdmin

//mostra os clientes
router.get("/",(req,res)=>{
    Cliente.find().lean().sort({data:"desc"}).then((clientes)=>{
        res.render("cliente/clientes", {clientes:clientes})
    }).catch((err)=>{
        req.flash("error_msg","Erro ao listar os clientes")
        res.redirect("/")
    })
})

//rota que da no formulario de cadastro de cliente
router.get("/add", (req,res)=>{
    res.render("cliente/addClientes")
})

//cadastra no banco
//falta conseguir pegar o valor do select do estado
    router.post("/novo", (req,res)=>{
        const novoCliente = {
            nome: req.body.nome,
            sobrenome:req.body.sobrenome,
            email:req.body.email,
            telefone:req.body.telefone,
            nomeMae:req.body.nomeMae,
            dataNascimento:req.body.dataNascimento,
            selectEstadoCivil:req.body.selectEstadoCivil,
            naturalidade:req.body.naturalidade,
            nacionalidade:req.body.nacionalidade,
            endereco:req.body.endereco,
            cidade:req.body.cidade,
            selectEstado:req.body.selectEstado,
            cep:req.body.cep,
            rg:req.body.rg,
            cpf:req.body.cpf,
            cnh:req.body.cnh,
            ctps:req.body.ctps
        }
        new Cliente(novoCliente).save().then(()=>{
            req.flash("success_msg", "Cliente salvo com sucesso")
            res.redirect("/cliente")
        }).catch((err)=>{
            req.flash("error_msg", "Erro ao salvar cliente")
            res.redirect("/cliente")
        })
       
    })

//apaga cliente
router.post("/deletar",eAdmin,(req,res)=>{
        Cliente.remove({_id:req.body.id}).then(()=>{
            req.flash("success_msg", "Cliente apagado com sucesso")
            res.redirect("/cliente")
        }).catch((err)=>{
            req.flash("error_msg", "Ocorreu um erro ao apagar o cliente")
            res.redirect("/cliente")
        })
    })

//edita o cliente
router.post("/editar",(req, res)=>{
    Cliente.findOne({_id: req.body.id}).then((clientes)=>{
        clientes.nome= req.body.nome,
        clientes.sobrenome=req.body.sobrenome,
        clientes.email=req.body.email,
        clientes.telefone=req.body.telefone,
        clientes.nomeMae=req.body.nomeMae,
        clientes.dataNascimento=req.body.dataNascimento,
        clientes.selectEstadoCivil=req.body.selectEstadoCivil,
        clientes.naturalidade=req.body.naturalidade,
        clientes.nacionalidade=req.body.nacionalidade,
        clientes.endereco=req.body.endereco,
        clientes.cidade=req.body.cidade,
        clientes.selectEstado=req.body.selectEstado,
        clientes.cep=req.body.cep,
        clientes.rg=req.body.rg,
        clientes.cpf=req.body.cpf,
        clientes.cnh=req.body.cnh,
        clientes.ctps=req.body.ctps,

        clientes.save().then(()=>{
            req.flash("success_msg", "Cliente editado com sucesso")
            res.redirect("/cliente")
            }).catch((err)=>{
                req.flash("error_msg", "Ocorreu um erro interno ao salvar a edição do cliente")
                res.redirect("/cliente")
            })
        }).catch((err)=>{
            req.flash("error_msg", "Ocorreu um erro ao editar o cliente")
            res.redirect("/cliente")
        })
}) 
    
//rota para a pagina do formulario de edição
router.get("/editar/:id",(req,res)=>{
    Cliente.findOne({_id:req.params.id}).lean().then((clientes)=>{
        res.render("cliente/editCliente", {clientes:clientes})
    })
})



//exportando as rotas
module.exports = router