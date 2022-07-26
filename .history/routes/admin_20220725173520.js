const express = require("express");
const router = express.Router()

router.get('/', (req, res) => {
    res.send("pagina principal do ADM")   
})

router.get('/posts', (req, res) => {
    res.send("pagina de posts")
})

router.get('/categorias', (req, res) => {
    res.send("pagina de categorias") 
})

router.get("/teste", (req, res) =>{
    res.send("isso é um teste")
})




module.exports = router