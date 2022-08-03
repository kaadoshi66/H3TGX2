module.exports = {
    eAdmim: function (req, res, next) {

        if (req.isAuthenticated() && req.user.eAdmim == 1) {
            return next();
        }

        req.flash("error_msg", "Você precisa ser um Admin!")
        res.redirect("/");

    }
}