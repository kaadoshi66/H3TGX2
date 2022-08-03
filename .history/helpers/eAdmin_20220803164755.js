module.exports = {
    eAdmim: function(req, res, next) {

        if (req.isAuthenticated() && req.user.eAdmim == true) {
            return next();
        }

        req.flash("error_msg", "Você precisa ser um Admin!")
        res.redirect("/");

    }
}