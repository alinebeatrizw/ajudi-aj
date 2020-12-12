//carregando modulos
const mongoose = require ("mongoose")
require("./models/Cliente")
const Cliente = mongoose.model("clientes")
require("./models/Processo")
const Processo = mongoose.model("processos")
const session = require("express-session")
const passport = require("passport")
const flash = require("connect-flash")//tipo de sessão que so aparece uma vez, usado nas notificações de erro e sucesso, quando att a pag ela some
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require ("body-parser")

const app = express()
const processo = require("./rotas/processo")
const cliente = require ("./rotas/cliente")
const admin = require("./rotas/admin")//chamando a rota de admin
const path = require("path")

const fs = require("fs");
const multer = require("multer");
const OAuth2Data = require("./credentials.json");
var name,pic
const { google } = require("googleapis");
var async = require("async");


/*const CLIENT_ID = OAuth2Data.installed.client_id;
const CLIENT_SECRET = OAuth2Data.installed.client_secret;
const REDIRECT_URL = OAuth2Data.installed.redirect_uris[0];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
var authed = false;

const SCOPES ="https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile";

*/


//configurações
    //sessao
    app.use(session({
        secret:"cursodenode",
        resave:true,
        saveUninitialized:true
    }))
    
    //passport
    app.use(passport.initialize())
    app.use(passport.session())



    
    //flash
    app.use(flash())
    //middlewares 
    app.use((req,res,next)=>{
        res.locals.success_msg = req.flash("success_msg")//locals é usado para guardar variaveis globais
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null //variavel para armazenar dados do usuario logado
        next()
    })
    //body parser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())

    //handlebars
    app.engine("handlebars", handlebars({defaultLayout:"main"}))
    app.set("view engine", "handlebars")
    //multer
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

    //mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/ajudiTcc",{
        useNewUrlParser:true,
        useUnifiedTopology: true
    }).then(()=>{
        console.log("Conectado ao mongo")
    }).catch((err)=>{
        console.log("erro ao se conectar " +err)
    })


    //public 
    app.use(express.static(path.join(__dirname, "public"))) //dizendo ao express que a pasta que guarda os arquivos estaticos é a public

    //rotas
app.use("/processo", processo)
app.use("/cliente", cliente)
app.use("/admin", admin)//usando a rota admin
//outros
const PORT = 8081
app.listen(PORT, ()=>{
    console.log("servidor rodando")
})