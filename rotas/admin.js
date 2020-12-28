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

/*
const CLIENT_ID = OAuth2Data.installed.client_id;
const CLIENT_SECRET = OAuth2Data.installed.client_secret;
const REDIRECT_URL = OAuth2Data.installed.redirect_uris[0];



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
*/
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
  



//exportando as rotas
module.exports = router