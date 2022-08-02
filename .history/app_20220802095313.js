//carregando modulos
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const admin = require("./routes/admin.js");
var path = require('path');
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("./models/Postagem");
const Postagem = mongoose.model("postagens");
require("./models/Categoria");
const Categoria = mongoose.model("categorias");
//configurações
//Sessão
app.use(session({
    secret: "palavra.segura.2",
    resave: true,
    saveUninitialized: true
}))
app.use(flash());
//middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg")
    next();
})
/*BODY PARSER*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//template engine
app.engine('.hbs', handlebars.engine({ extname: '.hbs', defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views', 'layouts') }));
app.set('view engine', '.hbs');
//Mongoose
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/APP").then(() => {
    console.log("MongoDB online . . .")
}).catch((erro) => {
    console.log("houve um erro ao se conectar ao servidor mongo: " + erro)
});
//public
app.use(express.static(path.join(__dirname, "public")))

//MIDDLEWAREteste!!!

app.use((req, res, next) => {
    console.log("atulizou a pagina ")
    next();
})

//rotas
app.get('/', (req, res) => {
    Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("index", { postagens: postagens })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.render("/404")
    })

    app.get("/postagem/:slug", (req, res) => {
        Postagem.findOne({ slug: req.params.slug }).lean().then((postagem) => {
            if (postagem) {
                res.render("postagem/index", { postagem: postagem })
            } else {
                req.flash("error_msg", "Esta postagem não existe")
                res.render("/")
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.render("/")
        })
    })

    app.get("/categorias", (req, res) => {
        Categoria.find().lean().then((categorias) => {
            res.render("categorias/index", { categorias: categorias })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao listar as categorias")
            res.render("/")
        })
    })

    app.get("/categorias/:slug", (req, res) => {
        Categoria.findOne({ slug: req.params.slug }).lean().then((categoria) => {
            if (categoria) {

                Postagem.find({ categoria: categoria._id }).lean().then((postagens) => {

                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro ao listar os posts!")
                    res.render("/")
                })

            } else {
                req.flash("error_msg", "Esta categoria não existe")
                res.render("/")
            }
        })
    })


    app.get("/404", (req, res) => {
        res.send('ERRO 404!!')
    })
})

app.use('/admin', admin)

//outros
const PORT = 8081;
app.listen(PORT, () => {
    console.log("Servidor Online ...")
});