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
    Categoria.find().sort({ date: 'desc' }).lean().then((categorias) => {
        res.render("admin/categorias", { categorias: categorias })
    }).catch((err) => {
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
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editcategorias", { categoria: categoria })
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })

})

router.post("/categorias/edit", (req, res) => {
    try {
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
            res.render("admin/categorias", { erros: erros })
        } else {
            var update = { nome: req.body.nome, slug: req.body.slug };
            Categoria.findOneAndUpdate({ _id: req.body.id }, update, { runValidators: true }, function (err) {
                if (err) {
                    console.log(err.message)
                    req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria")
                    res.redirect("/admin/categorias")
                }
                req.flash("success_msg", "Categoria editada com sucesso!!")
                res.redirect("/admin/categorias")
            })
        }


    } catch (e) {
        req.flash('alert', { type: 'danger', fixed: true, text: e.message.toString() });
        // console.log(e.message);
        res.redirect(`/admin/categorias/edit${req.params.id}?edit=false`);
    }

})

router.post("/categorias/deletar", (req, res) => {
    Categoria.remove({ _id: req.body.id }).lean().then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria")
        res.redirect()
    })
})

router.get("/postagens", (req, res) => {
    res.render("admin/postagens")
})
router.get("/postagens/add", (req, res)=>{
    res.render("")
})




module.exports = router