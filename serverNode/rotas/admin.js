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
const CLIENT_ID = OAuth2Data.installed.client_id;
const CLIENT_SECRET = OAuth2Data.installed.client_secret;
const REDIRECT_URL = OAuth2Data.installed.redirect_uris[0];
var EventModel = require('../models/event');
//const { link } = require("fs/promises")


var NOME_PASTA = "";
var ID_PASTA = "root"; //pasta padrão para o inicio
var FOLDER_PERMISSION = true;
var FOLDER_LEVEL = 0;
var NO_OF_FILES = 1000;
var ARQUIVOS_DRIVE = []; //array para os arquivos
var FILE_COUNTER = 0;
var FOLDER_ARRAY = [];




const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
var authed = false;

const SCOPES ="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile";
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "./images");
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    },
  });
  
  var upload = multer({
    storage: Storage,
  }).single("file"); //Field name and max count

//pagina inicial (nao tem nada ainda)
router.get("/", (req,res)=>{
    res.send("Página inicial")
})
//mostra os processos
router.get("/processos",(req,res)=>{
  Processo.find().lean().sort({data:"desc"}).then((processos)=>{
      res.render("admin/processos", {processos:processos})
  }).catch((err)=>{
      req.flash("error_msg","Erro ao listar os processos")
      res.redirect("/admin")
  })
})


router.get("/processos/add", (req,res)=>{
  Cliente.find().lean().then((clientes)=>{
      res.render("admin/addProcessos",{clientes:clientes})
  }).catch((err)=>{
      req.flash("error_msg", "Ocorreu um erro")
      res.redirect("/admin/processos")
  })
  
})

router.post("/processos/novo", (req,res)=>{
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
          res.redirect("/admin/processos")
      }).catch((err)=>{
          req.flash("error_msg", "Erro ao salvar")
          res.redirect("/admin/processos")
      })
  
})
//apaga processo
router.post("/processos/deletar",(req,res)=>{
  Processo.remove({_id:req.body.id}).then(()=>{
      req.flash("success_msg", "Processo apagado com sucesso")
      res.redirect("/admin/processos")
  }).catch((err)=>{
      req.flash("error_msg", "Ocorreu um erro ao apagar")
      res.redirect("/admin/processos")
  })
})

//edita o processo
router.post("/processos/editar",(req, res)=>{
  Processo.findOne({_id: req.body.id}).then((processos)=>{
      processos.numeroProcesso= req.body.numeroProcesso,
      processos.comarca=req.body.comarca,
      processos.vara=req.body.vara,
      processos.dataPropositura=req.body.dataPropositura,
      processos.valorCausa=req.body.valorCausa,
      processos.honorarios=req.body.honorarios,
      processos.descricao=req.body.descricao,
      //processos.cliente=req.body.cliente,


      processos.save().then(()=>{
          req.flash("success_msg", "Processo editado com sucesso")
          res.redirect("/admin/processos")
          }).catch((err)=>{
              req.flash("error_msg", "Ocorreu um erro interno ao salvar a edição")
              res.redirect("/admin/processos")
          })
      }).catch((err)=>{
          req.flash("error_msg", "Ocorreu um erro ao editar o processo")
          res.redirect("/admin/processos")
      })
}) 
  
//rota para a pagina do formulario de edição
router.get("/processos/editar/:id",(req,res)=>{
  Processo.findOne({_id:req.params.id}).lean().then((processos)=>{
      res.render("admin/editProcesso", {processos:processos})
  })
})

//mostra os clientes
router.get("/clientes",(req,res)=>{
    Cliente.find().lean().sort({data:"desc"}).then((clientes)=>{
        res.render("admin/clientes", {clientes:clientes})
    }).catch((err)=>{
        req.flash("error_msg","Erro ao listar os clientes")
        res.redirect("/admin")
    })
})

//rota que da no formulario de cadastro de cliente
router.get("/clientes/add", (req,res)=>{
    res.render("admin/addClientes")
})

//cadastra no banco
//falta conseguir pegar o valor do select do estado
    router.post("/clientes/novo", (req,res)=>{
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
            ctps:req.body.ctps,
            processo:req.body.processo,
            processo2:req.body.processo2,
            processo3:req.body.processo3,
            processo4:req.body.processo4
        }
        new Cliente(novoCliente).save().then(()=>{
            req.flash("success_msg", "Cliente salvo com sucesso")
            res.redirect("/admin/clientes")
        }).catch((err)=>{
            req.flash("error_msg", "Erro ao salvar cliente")
            res.redirect("/admin/clientes")
        })
    })

//apaga cliente
router.post("/clientes/deletar",(req,res)=>{
        Cliente.remove({_id:req.body.id}).then(()=>{
            req.flash("success_msg", "Cliente apagado com sucesso")
            res.redirect("/admin/clientes")
        }).catch((err)=>{
            req.flash("error_msg", "Ocorreu um erro ao apagar o cliente")
            res.redirect("/admin/clientes")
        })
    })

//edita o cliente
router.post("/clientes/editar",(req, res)=>{
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
        clientes.processo=req.body.processo,
        clientes.processo2=req.body.processo2,
        clientes.processo3=req.body.processo3,
        clientes.processo4=req.body.processo4,



        clientes.save().then(()=>{
            req.flash("success_msg", "Cliente editado com sucesso")
            res.redirect("/admin/clientes")
            }).catch((err)=>{
                req.flash("error_msg", "Ocorreu um erro interno ao salvar a edição do cliente")
                res.redirect("/admin/clientes")
            })
        }).catch((err)=>{
            req.flash("error_msg", "Ocorreu um erro ao editar o cliente")
            res.redirect("/admin/clientes")
        })
}) 
    
//rota para a pagina do formulario de edição
router.get("/clientes/editar/:id",(req,res)=>{
    Cliente.findOne({_id:req.params.id}).lean().then((clientes)=>{
        res.render("admin/editCliente", {clientes:clientes})
    })
})


//fazer login com google e ir para pagina de upload
router.get("/documentos", (req, res) => {
    if (!authed)  {
      // Generate an OAuth URL and redirect there
      var url = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
      });
      console.log(url);
      res.render("admin/loginDrive", { url: url });
    } else {
      var oauth2 = google.oauth2({
        auth: oAuth2Client,
        version: "v2",
      });
      oauth2.userinfo.get(function (err, response) {
        if (err) {
          console.log(err);
        } else {
          console.log(response.data);
          name = response.data.name
          pic = response.data.picture
          res.render("admin/uploadDrive", {
            name: response.data.name,
            pic: response.data.picture,
            success:false
          });
        }
      });
    }
  });

router.post("/upload", (req, res) => {
    
  });
  
router.get('/logout',(req,res) => {
      authed = false
      res.redirect('/admin/documentos')
  })
  
router.get("/google/callback", function (req, res) {
    const code = req.query.code;
    if (code) {
      // Get an access token based on our OAuth code
      oAuth2Client.getToken(code, function (err, tokens) {
        if (err) {
          console.log("Error authenticating");
          console.log(err);
        } else {
          console.log("Successfully authenticated");
          console.log(tokens)
          oAuth2Client.setCredentials(tokens);
  
  
          authed = true;
          res.redirect("/admin/clientes");
          
            
            files.map((file) => {
              console.log(file);
            });
            
          
        }
      });
    }
  });
  

router.get("/agenda", (req,res)=>{
  fs.readFile('./fullcalendar.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
})



//exportando as rotas
module.exports = router