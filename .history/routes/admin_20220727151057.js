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
    Categoria.find().sort({date:'desc'}).lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) =>{
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
    
})

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/add', (req, res) => {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.nome == null) {
        erros.push({ texto: "Slug inválido" })
    }

    if (req.body.nome.length < 2) {
        erros.push({ texto: "Nome da categoria muito pequeno" })
    }

    if (erros.length > 0) {
        res.render("admin/addcategorias", { erros: erros })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
           req.flash("success_msg", "Categoria criada com sucesso!")
           res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin")
        })
    }
})

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({_id:req.body.id}).then((categoria) => {
        res.render("admin/editcategorias", {categoria:categoria})
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })
   
})

router.get("/teste", (req, res) => {
    res.send("isso é um teste")
})




module.exports = router