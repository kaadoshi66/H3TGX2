module.exports = {
    eAdmim: function(req, res, next){

        if(req.isAuthenticated( && req.user.eAdmim == true){
            return next();
        }

        req.flash("error_msg", "Você deve estar logado para entrar aqui")
        res.redirect("/");

    }
}