//carregando modulos
import express from "express";
const app =express();
import { engine } from "express-handlebars";
import { urlencoded, json } from "body-parser";
import admin from "./routes/admin";
import { join } from 'path';
//const mongoose = require ("mongoose");

//configurações
/*BODY PARSER*/
app.use(urlencoded({extended: true}));
app.use(json);
//template engine
app.engine('.hbs', engine({extname:'.hbs',defaultLayout: 'main', layoutsDir: join(__dirname, 'views', 'layouts')}));
app.set('view engine', '.hbs');
//Mongoose

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