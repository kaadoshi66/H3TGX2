import { Router } from "express";
const router = Router()

router.get('/', (_req, res) => {
    res.send("pagina principal do ADM")   
})

router.get('/posts', (_req, res) => {
    res.send("pagina de posts")
})

router.get('/categorias', (_req, res) => {
    res.send("pagina de categorias") 
})

router.get("/teste", (_req, res) =>{
    res.send("isso é um teste")
})




export default router