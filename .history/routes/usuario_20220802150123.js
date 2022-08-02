const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

router.get("/usuarios", (req, res) =>{
    res.render("usuarios/registro")
})




module.exports = router