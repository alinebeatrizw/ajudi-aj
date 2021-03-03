module.exports = {
    eAdmin: function(req,res,next){
        //verifica se o usuario ta logado e é  admin
        if(req.isAuthenticated() && req.user.eAdmin == 1 ){
            return next()
        }
        req.flash("error_msg", "Você precisa ser admin para executar essa ação!")
        res.redirect("/")
    }
  
}