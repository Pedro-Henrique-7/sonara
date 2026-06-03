const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerEventoArtistaStatus = require('../controller/evento_artista_status/evento_artista_status')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})




// retornar todos os generos
router.get('/', cors(), async function (request, response){
/*  #swagger.tags = ['Evento Artista Status']
    #swagger.summary = 'Listar histórico de status do artista no evento'
    #swagger.responses[200] = { description: 'Lista retornada' } */
 
  let EventoArtistaStatus  = await controllerEventoArtistaStatus.listarEventoArtistaStatus()
    
    response.status(EventoArtistaStatus.status_code)
    response.json(EventoArtistaStatus)
})
module.exports = router 


// pegar EventoArtistaStatus por id
router.get('/:id', cors(), async function (request, response){
    /*  #swagger.tags = ['Evento Artista Status']
    #swagger.summary = 'Buscar status artista-evento por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Encontrado' }
    #swagger.responses[404] = { description: 'Não encontrado' } */
    let IdEventoArtistaStatus = request.params.id

    let EventoArtistaStatus = await controllerEventoArtistaStatus.buscarEventoArtistaStatusId(IdEventoArtistaStatus)
    response.status(EventoArtistaStatus.status_code)
    response.json(EventoArtistaStatus)  


})


//inserir EventoArtistaStatus
router.post('/', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Evento Artista Status']
    #swagger.summary = 'Registrar status do artista no evento'
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/EventoArtistaStatus' } }
    #swagger.responses[201] = { description: 'Status registrado' }
    #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let EventoArtistaStatus = await controllerEventoArtistaStatus.inserirEventoArtistaStatus(dadosBody, contentType)

    response.status(EventoArtistaStatus.status_code)
    response.json(EventoArtistaStatus)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {

    /*  #swagger.tags = ['Evento Artista Status']
    #swagger.summary = 'Atualizar status do artista no evento'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/EventoArtistaStatus' } }
    #swagger.responses[200] = { description: 'Atualizado' } */

    let dadosBody = request.body
    
    let IdEventoArtistaStatus = request.params.id

    let contentType = request.headers['content-type']

    let EventoArtistaStatus = await controllerEventoArtistaStatus.atualizarEventoArtistaStatus(dadosBody, IdEventoArtistaStatus, contentType)
    response.status(EventoArtistaStatus.status_code)
    response.json(EventoArtistaStatus)
})

router.delete('/:id', cors(), async function(request, response) {

    /*  #swagger.tags = ['Evento Artista Status']
    #swagger.summary = 'Excluir status do artista no evento'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Excluído' } */
 
    let IdEventoArtistaStatus = request.params.id

    let EventoArtistaStatus = await controllerEventoArtistaStatus.excluirEventoArtistaStatus(IdEventoArtistaStatus)
    response.status(EventoArtistaStatus.status_code)
    response.json(EventoArtistaStatus)
})
  