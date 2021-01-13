//carregando modulos
const mongoose = require ("mongoose")
const session = require("express-session")
const flash = require("connect-flash")//tipo de sessão que so aparece uma vez, usado nas notificações de erro e sucesso, quando att a pag ela some
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require ("body-parser")
const app = express()
const agenda = require("./rotas/agenda")
const processo = require("./rotas/processo")
const cliente = require ("./rotas/cliente")
const gerarPdf = require ("./rotas/gerarPdf")
const documentos = require ("./rotas/documentos")
const usuarios = require("./rotas/usuario")
const path = require("path")
const passport = require("passport")
require("./config/auth")(passport)




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

app.get("/",(req,res)=>{
    res.render("pagina-inicial/index")
})

app.use("/usuarios", usuarios)
app.use("/processo", processo)
app.use("/gerarPdf", gerarPdf)
app.use("/cliente", cliente)
app.use("/agenda", agenda)
app.use("/documentos", documentos)

//abrir servidor
const PORT = 8081
app.listen(PORT,  ()=>{
    console.log("servidor rodando")
})