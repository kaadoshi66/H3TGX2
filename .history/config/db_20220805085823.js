if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI:"mongodb+srv://kaadoshi:Meliodas17@cluster0.rkwhvra.mongodb.net/test"}
}else{
    module.exports = {mongoURI:"mongodb://localhost/APP"}
}