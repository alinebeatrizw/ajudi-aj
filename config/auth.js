const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//MODEL USUARIO

require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

module.exports = function(passport){

    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'},(email, senha, done)=>{
        //primeiro verifica se o email em questao esta cadastrado
        Usuario.findOne({email: email}).then((usuario)=> {
            if(!usuario){
                return done(null, false, {message: "Esta conta não existe"})
            }
            
            //depois verifica se a senha a senha digitada bate com a senha do email cadastrado
            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })
    }))

    passport.serializeUser((usuario, done)=> {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario)=> {
            done(err, usuario)
        })
    })

}