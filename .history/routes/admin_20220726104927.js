const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categorias = mongoose.model("categorias")

router.get('/', (req, res) => {
    res.render("admin/index")
       
})

router.get('/posts', (req, res) => {
    res.send("pagina de posts")
})

router.get('/categorias', (req, res) => {
    res.render("admin/categorias") 
})

router.get('/categorias/add', (req, res) =>{
    res.render("admin/addcategorias")
})

router.get('/categorias/nova', (req, res) =>{

})

router.get("/teste", (req, res) =>{
    res.send("isso é um teste")
})




module.exports = router