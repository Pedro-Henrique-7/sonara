const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerOrganizadorEventos = require('../../controller/VIEWS/organizadoEvento')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})



// pegar Organizador de Eventos por id
router.get('/:id', cors(), async function (request, response){
    let idOrganizadorEventos = request.params.id

    let organizadorEventos = await controllerOrganizadorEventos.buscarEventoOrganizador(idOrganizadorEventos)
    response.status(organizadorEventos.status_code)
    response.json(organizadorEventos)  


})

module.exports = router 