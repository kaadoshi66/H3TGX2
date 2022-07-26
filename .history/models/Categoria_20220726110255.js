const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const Categoria = new Schema({
    nome: {
        type:String,
        requied: true
    },
    slug: {
        type:String,
        requied: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("categoria", Categoria)