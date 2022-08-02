const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome Inválido" })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: "E-mail Inválido" })
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: "Senha Inválido" })
    }

    if (req.body.senha.length < 4) {
        erros.push({ texto: "Senha muito curta" })
    }

    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: "As senhas são diferentes, tente novamente" })
    }

    if (erros.length > 0) {

        res.render("usuarios/registro", { erros: erros })

    } else {
        Usuario.findOne({ email: req.body.email }).lean().then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Já existe uma conta com este e-mail")
                res.redirect("/")
            }else{



                
            }
        }).catch((err)=>{
            req.flash("error_msg", "Houve um erro Interno")
            res.redirect("/")
        })

    }
})




module.exports = router