
const express = require("express")//express
const router = express.Router()//colocando a função de rotas do express dentro da constante

router.get("/", (req,res)=>{
    res.render("documentos/google-drive")
})

//exportando as rotas
module.exports = router