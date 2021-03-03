const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

const bcrypt = require("bcryptjs")
const passport = require("passport");




router.get("/registro", (req,res)=>{
    res.render("usuarios/registro")
})

router.post("/registro", (req, res)=>{
    
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"});
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido"});
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida"});
    }
    if(req.body.senha.length < 4 ){
        erros.push({texto: "Senha muito curta"});
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas não conferem"});
    }
    
    if(erros.length > 0 ){
        res.render("usuarios/registro", {erros:erros})
    }else{
        //verifica se o email ja existe
        Usuario.findOne({email: req.body.email}).lean().then((usuario)=>{
            if(req.body.checkboxAdmin){
                req.body.checkboxAdmin = 1
            }else{
                req.body.checkboxAdmin = 0 
            }
            if(usuario){
                req.flash("error_msg", "Email ja cadastrado")
                res.redirect("/usuarios/registro")
            }else{
                const novoUsuario = new Usuario({
                    nome:req.body.nome,
                    email:req.body.email,
                    senha:req.body.senha,
                    eAdmin:  req.body.checkboxAdmin
                })
                
                bcrypt.genSalt(10, (erro, salt)=>{
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
                        if(erro){
                            req.flash("error_msg", "Erro")
                            res.redirect("/")
                        }

                        novoUsuario.senha = hash

                        novoUsuario.save().then(()=>{
                            req.flash("success_msg", "Conta criada com sucesso")
                            res.redirect("/")
                        }).catch((err)=>{
                            req.flash("error_msg", "Erro ao criar usuário")
                            res.redirect("/usuarios/registro")
                        })
                    })
                })
            }
        }).catch((err)=>{
            req.flash("error_msg", "Erro")
            res.redirect("/")
        })
    }
})

router.get("/login", (req,res)=>{
    res.render("usuarios/login")
})

router.get("/logout", (req,res)=>{
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso")
    res.redirect("/")
})

//login autentização
router.post("/login", (req, res, next)=>{
    passport.authenticate("local", {
        successRedirect:"/",
        failureRedirect:"/usuarios/login",
        failureFlash:true
    })(req,res,next)
})

module.exports = router;