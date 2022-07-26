//carregando modulos
const express = require ('express');
const handlebars = require ('express-handlebars');
const bodyParser = require ('body-parser');
const { application } = require('express');
//const mongoose = require ("mongoose");

//configurações
//BODY PARSER
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json);
//template engine
app.engine('.hbs', handlebars.engine({extname:'.hbs',defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views', 'layouts')}));
app.set('view engine', '.hbs');
//Mongoose
//rotas


//outros
const PORT = 8081;
app.listen(PORT, () =>{
    console.log("Servidor Online ...")
});