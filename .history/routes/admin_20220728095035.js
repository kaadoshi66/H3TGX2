const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

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
            console.log(err)
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
router.get("/postagens/add", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagens", { categorias: categorias })
    }).catch((err) => {
        console.log(err)
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})

router.post("/postagens/nova", (req, res) => {
      
 var erros = []

 if(req.body.categoria == "0"){
    
    erros.push ({ texto: "Categoria invalida, registre uma categoria" })
 }

 if(erros.length > 0){
    
    res.render("admin/aadpostagem", {erros: erros})
    }else{
       const novaPostagem = {
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria
       } 

       new Postagem(novaPostagem).save().lean().then(()=>{
        req.flash("success_msg", "Postagem criada com sucesso")
        res.redirect("/admin/postagens")
       }).catch((err) =>{
        req.flash("error_msg", "Houve um erro durante o salvamento da postagem")
        res.redirect("/admin/postagens")
       })

    }

})




module.exports = router