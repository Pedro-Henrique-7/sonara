const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerEventoStatus = require('../controller/eventos_status/evento_staus')

//configurção do cors 
const router = express.Router()
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})




// retornar todos os generos
router.get('/', cors(), async function (request, response) {

    /*  #swagger.tags = ['Evento Status']
    #swagger.summary = 'Listar histórico de status dos eventos'
    #swagger.responses[200] = { description: 'Lista retornada' } */

    let EventoStatus = await controllerEventoStatus.listarEventoStatus()

    response.status(EventoStatus.status_code)
    response.json(EventoStatus)
})
module.exports = router


// pegar EventoStatus por id
router.get('/:id', cors(), async function (request, response) {

    /*  #swagger.tags = ['Evento Status']
    #swagger.summary = 'Buscar status de evento por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Status encontrado' }
    #swagger.responses[404] = { description: 'Não encontrado' } */

    let IdEventoStatus = request.params.id

    let EventoStatus = await controllerEventoStatus.buscarEventoStatusId(IdEventoStatus)
    response.status(EventoStatus.status_code)
    response.json(EventoStatus)


})


//inserir EventoStatus
router.post('/', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Evento Status']
    #swagger.summary = 'Registrar status de evento'
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/EventoStatus' } }
    #swagger.responses[201] = { description: 'Status registrado' }
    #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */

    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let EventoStatus = await controllerEventoStatus.inserirEventoStatus(dadosBody, contentType)

    response.status(EventoStatus.status_code)
    response.json(EventoStatus)
})


router.put('/:id', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Evento Status']
    #swagger.summary = 'Atualizar status de evento'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/EventoStatus' } }
    #swagger.responses[200] = { description: 'Atualizado' } */


    let dadosBody = request.body

    let IdEventoStatus = request.params.id

    let contentType = request.headers['content-type']

    let EventoStatus = await controllerEventoStatus.atualizarEventoStatus(dadosBody, IdEventoStatus, contentType)
    response.status(EventoStatus.status_code)
    response.json(EventoStatus)
})

router.delete('/:id', cors(), async function (request, response) {

    /*  #swagger.tags = ['Evento Status']
    #swagger.summary = 'Excluir status de evento'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Excluído' } */


    let IdEventoStatus = request.params.id

    let EventoStatus = await controllerEventoStatus.excluirEventoStatus(IdEventoStatus)
    response.status(EventoStatus.status_code)
    response.json(EventoStatus)
})
