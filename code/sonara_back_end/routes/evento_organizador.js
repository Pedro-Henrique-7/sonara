const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllereventoOrganizador = require('../controller/evento_organizador/evento_organizador.js')

//configurção do cors 
const router = express.Router()
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// ENDPOINTS DA TABELA eventoOrganizador


// retornar todos os eventoOrganizadors
router.get('/', cors(), async function (request, response) {
    /*  #swagger.tags = ['Evento x Organizador']
        #swagger.summary = 'Listar todos os vínculos evento-organizador'
        #swagger.responses[200] = { description: 'Lista retornada' } */
    let eventoOrganizador = await controllereventoOrganizador.listarEventoOrganizador()

    response.status(eventoOrganizador.status_code)
    response.json(eventoOrganizador)
})
module.exports = router


// pegar eventoOrganizador por id
router.get('/:id', cors(), async function (request, response) {

    /*  #swagger.tags = ['Evento x Organizador']
    #swagger.summary = 'Buscar vínculo evento-organizador por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Vínculo encontrado' }
    #swagger.responses[404] = { description: 'Não encontrado' } */
    let ideventoOrganizador = request.params.id

    let eventoOrganizador = await controllereventoOrganizador.buscarEventoOrganizadorId(ideventoOrganizador)
    response.status(eventoOrganizador.status_code)
    response.json(eventoOrganizador)


})


//inserir eventoOrganizador
router.post('/', cors(), bodyParserJson, async function (request, response) {
    /*  #swagger.tags = ['Evento x Organizador']
    #swagger.summary = 'Criar vínculo evento-organizador'
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/EventoOrganizador' } }
    #swagger.responses[201] = { description: 'Vínculo criado' }
    #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */

    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let eventoOrganizador = await controllereventoOrganizador.inserirEventoOrganizador(dadosBody, contentType)

    response.status(eventoOrganizador.status_code)
    response.json(eventoOrganizador)
})


router.put('/:id', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Evento x Organizador']
    #swagger.summary = 'Atualizar vínculo evento-organizador'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/EventoOrganizador' } }
    #swagger.responses[200] = { description: 'Atualizado' } */
    let dadosBody = request.body

    let ideventoOrganizador = request.params.id

    let contentType = request.headers['content-type']

    let eventoOrganizador = await controllereventoOrganizador.atualizarEventoOrganizador(dadosBody, ideventoOrganizador, contentType)
    response.status(eventoOrganizador.status_code)
    response.json(eventoOrganizador)
})

router.delete('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Evento x Organizador']
    #swagger.summary = 'Excluir vínculo evento-organizador'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Excluído' } */
 
    let ideventoOrganizador = request.params.id

    let eventoOrganizador = await controllereventoOrganizador.excluirEventoOrganizador(ideventoOrganizador)
    response.status(eventoOrganizador.status_code)
    response.json(eventoOrganizador)
})
