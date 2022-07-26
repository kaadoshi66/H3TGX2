//carregando modulos
const express = require ("express");
const app =express();
const handlebars = require ("express-handlebars");
const bodyParser = require ("body-parser");
const admin = require ("./routes/admin.js");
var path = require('path');
const mongoose = require ("mongoose");
const session = require ("express-session");
const flash = require ("connect-flash")

//configurações
//Sessão
    app.use(session({
        secret: "palavra.segura.2",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
//middleware
    app.use((req, res, next) => {
        
    })
/*BODY PARSER*/
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//template engine
app.engine('.hbs', handlebars.engine({extname:'.hbs',defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views', 'layouts')}));
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
    console.log("oi sou um middleware!")
    next();
})

//rotas
app.get('/', (req, res) => {
    res.send('Rota principal')
})   
app.use('/admin', admin)

//outros
    const PORT = 8081;
    app.listen(PORT, () =>{
        console.log("Servidor Online ...")
    });