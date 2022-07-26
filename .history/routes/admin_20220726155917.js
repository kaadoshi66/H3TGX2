const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");

router.get('/', (req, res) => {
    res.render("admin/index")

})

router.get('/posts', (req, res) => {
    res.send("pagina de posts")
})

router.get('/categorias', (req, res) => {
    res.render("admin/categorias")
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', (req, res) => {
    try {
        var erros = []

        if (req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({ texto: "Nome inválido" })
        }

        if (req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({ texto: "Slug invalido" })
        }

        if (req.body.nome.length < 2) {
            erros.push({ texto: "Nome da categoria é muito pequeno" })
        }

        if (erros.length > 0) {
            res.render("admin/addcategorias", { erros: erros })
        }

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            console.log("Categoria salva com sucesso!")
        }).catch((err) => {
            console.log("Erro ao salvar categoria!" + err)
        })
    } catch(e){
        req.flash('alert', { type: 'danger', fixed: true, text: e.message.toString() });
        res.redirect('/admin/categorias/nova' + '?edit=false');
    }
     
    

})

router.get("/teste", (req, res) => {
    res.send("isso é um teste")
})




module.exports = router