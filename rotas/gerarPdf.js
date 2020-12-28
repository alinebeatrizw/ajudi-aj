const express = require('express');
const router = express.Router();


const mongoose = require("mongoose");//mongoose
const { readFile } = require('fs');
require("../models/Cliente")//model de cliente
const Cliente = mongoose.model("clientes")//colocando o model dentro da costante
require("../models/Processo")
const Processo = mongoose.model("processos")
require("../models/Evento")
const Evento = mongoose.model("eventos")

const pdf = require('html-pdf')
const jsreport = require('jsreport');
const fs = require("fs");
const { options } = require('./agenda');






router.post("/gerar", (req,res)=>{
   
    async function beforeRender(req, res) {
        const conn = await MongoClient.connect('mongodb://localhost/ajudiTcc');
        Object.assign(req.data, { 
          eventos: await conn.db('ajudiTcc').collection('eventos').find().toArray()
        });
    }

        jsreport.render({
            template: {
              content: `Teste PDF {{#each eventos}} {{nomeEvento}} {{/each}}`,
              engine: 'handlebars',
              recipe: 'chrome-pdf'
            }
          }).then((out)  => {
            out.stream.pipe(res);
    
            //para fazer download
            res.writeHead(200, 
                {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition':'attachment;filename="relatorio-AJUDI.pdf"'
                });
        
                const download = Buffer.from(data.toString('utf-8'), 'base64');
                res.end(download);
            
          }).catch((e) => {
            res.end(e.message);
          });
    })



module.exports = router;