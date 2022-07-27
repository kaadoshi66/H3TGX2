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

router.post('/categorias/add', async(req, res) => {
    try {
        var erros = []

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            // erros.push({ texto: "Nome inválido" });
            throw new Error('Nome inválido');
        }

        if (!req.body.slug || typeof req.body.slug == undefined || req.body.nome == null) {
            // erros.push({ texto: "Slug inválido" })
            throw new Error('Slug inválido');
        }

        if (!req.body.nome.length < 2) {
            // erros.push({ texto: "Nome da categoria muito pequeno" })
            throw new Error('Nome da categoria muito pequeno');
        }

        if (erros.length > 0) {
            // res.render("admin/addcategorias", { erros: erros })
            // erros.push({ texto: `Existe ${erros.length} erro(s)` })
            throw new Error(`Existe ${erros.length} erro(s)`);
            //res.redirect()
        }
        var novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        await new Categoria(novaCategoria).save().then(async() => {
            req.flash('alert', { type: 'success', fixed: true, text: 'Salvo' });
            res.redirect('/admin/categorias');
        }).catch((err) => {
            console.log("Erro ao salvar categoria!" + err)
        })
    } catch (e) {
        req.flash('alert', { type: 'danger', fixed: true, text: e.message.toString() });
        // console.log(e.message);
        res.redirect('/admin/categorias/add?edit=false');
    }

})

router.get("/teste", (req, res) => {
    res.send("isso é um teste")
})




module.exports = router