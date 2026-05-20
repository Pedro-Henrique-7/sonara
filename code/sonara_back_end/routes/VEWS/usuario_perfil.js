const express = require('express')
const cors = require('cors')

const controllerUsuarioPerfil = require('../../controller/VIEWS/usuario_perfil')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    next()
})

router.get('/', cors(), async function (request, response) {
    const usuarioPerfil = await controllerUsuarioPerfil.listarPerfilUsuario()
    response.status(usuarioPerfil.status_code)
    response.json(usuarioPerfil)
})

module.exports = router
