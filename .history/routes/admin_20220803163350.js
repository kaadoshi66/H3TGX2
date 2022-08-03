const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");
require("../models/Postagem");
const Postagem = mongoose.model("postagens");
const {eAdmin} = require("../helpers/eAdmin")

router.get('/', eAdmin, (req, res) => {
    res.render("admin/index")

})

router.get('/posts', eAdmin, (req, res) => {
    res.send("pagina de posts")
})

router.get('/categorias', eAdmin, (req, res) => {
    Categoria.find().sort({ date: 'desc' }).lean().then((categorias) => {
        res.render("admin/categorias", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })

})

router.get('/categorias/add', eAdmin, (req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/add', eAdmin, (req, res) => {

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

    if (req.body.slug.length < 2) {
        erros.push({ texto: "Slug da categoria muito pequeno" })
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
            console.log(err)
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin")
        })
    }
})

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editcategorias", { categoria: categoria })
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categorias")
    })

})

router.post("/categorias/edit", eAdmin, (req, res) => {
    try {
        var erros = []

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({ texto: "Nome inválido" })
        }

        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({ texto: "Slug inválido" })
        }

        if (req.body.nome.length < 2) {
            erros.push({ texto: "Nome da categoria muito pequeno" })
        }

        if (erros.length > 0) {
            res.render("admin/categorias", eAdmin, { erros: erros })
        } else {
            var update = { nome: req.body.nome, slug: req.body.slug };
            Categoria.findOneAndUpdate({ _id: req.body.id }, update, { runValidators: true }, function (err) {
                if (err) {
                    console.log(err)
                    req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria")
                    res.redirect("/admin/categorias")
                }
                req.flash("success_msg", "Categoria editada com sucesso!!")
                res.redirect("/admin/categorias")
            })
        }


    } catch (e) {
        req.flash('alert', { type: 'danger', fixed: true, text: e.message.toString() });
        console.log(e);
        res.redirect(`/admin/categorias/edit${req.params.id}?edit=false`);
    }

})

router.post("/categorias/deletar", eAdmin, (req, res) => {
    Categoria.remove({ _id: req.body.id }).lean().then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria")
        res.redirect()
    })
})

router.get("/postagens", eAdmin, (req, res) => {
    Postagem.find().populate("categoria").lean().sort({ data: "desc" }).then((postagens) => {

        res.render("admin/postagens", { postagens: postagens })
    }).catch((err) => {

        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/admin")
    })

})
router.get("/postagens/add", eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {

        res.render("admin/addpostagens", { categorias: categorias })
    }).catch((err) => {

        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})

router.post("/postagens/nova", eAdmin, (req, res) => {

    var erros = []

    if (!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null) {
        erros.push({ texto: "Titulo inválido" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug inválido" })
    }

    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        erros.push({ texto: "Descrição inválido" })
    }

    if (!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null) {
        erros.push({ texto: "Conteúdo inválido" })
    }

    if (req.body.categoria == "0") {

        erros.push({ texto: "Categoria invalida, registre uma categoria" })
    }

    if (req.body.titulo.length < 2) {
        erros.push({ texto: "Titulo da postagem é pequeno" })
    }

    if (req.body.slug.length < 2) {
        erros.push({ texto: "Slug da postagem é pequeno" })
    }

    if (req.body.descricao.length < 2) {
        erros.push({ texto: "Descrição da postagem é pequeno" })
    }

    if (req.body.conteudo.length < 2) {
        erros.push({ texto: "Conteúdo da postagem é pequeno" })
    }


    if (erros.length > 0) {

        res.render("admin/addpostagens", { erros: erros })

    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash('alert', { type: 'success', fixed: true, text: 'Salvo' });
            // req.flash("success_msg", "Postagem criada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) => {

            req.flash('alert', { type: 'danger', fixed: true, text: e.message.toString() });
            // req.flash("error_msg", "Houve um erro durante o salvamento da postagem")
            res.redirect("/admin/postagens")
        })

    }

})


router.get("/postagens/edit/:id", eAdmin, (req, res) => {
    Postagem.findOne({ _id: req.params.id }).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", { categorias: categorias, postagem: postagem })
        }).catch((err) => {

            req.flash("error-msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin/postagens")
        })
    }).catch((err) => {

        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagens/edit", eAdmin, (req, res) => {

    try {

        var update = { titulo: req.body.titulo, slug: req.body.slug, descricao: req.body.descricao, conteudo: req.body.conteudo, categoria: req.body.categoria };
        Postagem.findOneAndUpdate({ _id: req.body.id }, update, { runValidators: true }, function (err) {
            if (err) {

                req.flash("error_msg", "Houve um erro interno ao salvar a edição da postagem")
                res.redirect("/admin/postagens")
            }
            req.flash("success_msg", "Postagem editada com sucesso!!")
            res.redirect("/admin/postagens")
        })


    } catch (e) {

        req.flash('alert', { type: 'danger', fixed: true, text: e.message.toString() });
        res.redirect(`/admin/postagens/edit/${req.body.id}?edit=false`);
    }

})

router.get("/postagens/deletar/:id", eAdmin, (req, res) => {
    Postagem.remove({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso!!")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/admin/postagens")
    })
})



module.exports = router