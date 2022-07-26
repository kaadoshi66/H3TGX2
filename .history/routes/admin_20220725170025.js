const express = require("express");
const router = express.router();

router.get('/', (req, res) => {
    res.send("pagina principal do ADM")   
});

router.get('/posts', (req, res) => {
    res.send("pagina de posts")
});

router.get('/categorias', (req, res) => {
    res.send("pagina de categorias") 
});







module.exports = router