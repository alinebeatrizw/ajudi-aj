const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const path = require("path");
const handlebars = require("handlebars");
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
    Evento.find().lean().then((eventos)=>{
        res.render("agenda/pdf", {eventos:eventos})
    }).catch((err)=>{
        req.flash("error_msg","Erro ao listar os clientes")
        res.redirect("/")
    })
    
   
/*** 
    try {
      (async () => {
          var dataBinding = {
              items: [{
                  name: "item 1",
                  price: 100
              },
              {
                  name: "item 2",
                  price: 200
              },
              {
                  name: "item 3",
                  price: 300
              }
              ],
              total: 600,
              isWatermark: true
          }
  
          var templateHtml = fs.readFileSync(path.join(process.cwd(), './views/agenda/relatorio.handlebars'),  'utf8');
          var template = handlebars.compile(templateHtml);
          var finalHtml = encodeURIComponent(template(dataBinding));
          var options = {
              format: 'A4',
              headerTemplate: "<p></p>",
              footerTemplate: "<p></p>",
              displayHeaderFooter: false,
              margin: {
                  top: "40px",
                  bottom: "100px"
              },
              printBackground: true,
              path: 'relatorios/Relatorio.pdf'
          }
  
          const browser = await puppeteer.launch({
              args: ['--no-sandbox'],
              headless: true
          });
          const page = await browser.newPage();
          await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
              waitUntil: 'networkidle0'
          });
          await page.pdf(options);
          await browser.close();
  
          res.type("pdf")
          res.download("relatorios/Relatorio.pdf")
           
  
      })();
  } catch (err) {
      console.log('ERROR:', err);
  }
 

    */   
    
  })   
         
    



module.exports = router;