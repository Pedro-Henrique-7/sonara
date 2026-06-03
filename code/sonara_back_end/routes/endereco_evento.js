const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerEnderecoEvento = require('../controller/endereco_evento/endereco_evento')

//configurção do cors 
const router = express.Router()
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// ENDPOINTS DA TABELA EnderecoEvento


// retornar todos os EnderecoEventoEvento
router.get('/', cors(), async function (request, response) {
    /*  #swagger.tags = ['Endereco Evento']
        #swagger.summary = 'Listar endereços de eventos'
        #swagger.responses[200] = { description: 'Lista retornada' } */
    let EnderecoEvento = await controllerEnderecoEvento.listarEnderecoEvento()

    response.status(EnderecoEvento.status_code)
    response.json(EnderecoEvento)
})
module.exports = router


// pegar EnderecoEvento por id
router.get('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Endereco Evento']
    #swagger.summary = 'Buscar endereço de evento por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Endereço encontrado' }
    #swagger.responses[404] = { description: 'Não encontrado' } */
    let idEnderecoEvento = request.params.id

    let EnderecoEvento = await controllerEnderecoEvento.buscarEnderecoEventoId(idEnderecoEvento)
    response.status(EnderecoEvento.status_code)
    response.json(EnderecoEvento)


})


//inserir EnderecoEvento
router.post('/', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Endereco Evento']
        #swagger.summary = 'Cadastrar endereço de evento'
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/EnderecoEvento' } }
        #swagger.responses[201] = { description: 'Endereço criado' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let EnderecoEvento = await controllerEnderecoEvento.inserirEnderecoEvento(dadosBody, contentType)

    response.status(EnderecoEvento.status_code)
    response.json(EnderecoEvento)
})


router.put('/:id', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Endereco Evento']
    #swagger.summary = 'Atualizar endereço de evento'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/EnderecoEvento' } }
    #swagger.responses[200] = { description: 'Atualizado' } */
    let dadosBody = request.body

    let idEnderecoEvento = request.params.id

    let contentType = request.headers['content-type']

    let EnderecoEvento = await controllerEnderecoEvento.atualizarEnderecoEvento(dadosBody, idEnderecoEvento, contentType)
    response.status(EnderecoEvento.status_code)
    response.json(EnderecoEvento)
})

router.delete('/:id', cors(), async function (request, response) {

    /*  #swagger.tags = ['Endereco Evento']
        #swagger.summary = 'Excluir endereço de evento'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
        #swagger.responses[200] = { description: 'Excluído' } */

    let idEnderecoEvento = request.params.id

    let EnderecoEvento = await controllerEnderecoEvento.excluirEnderecoEvento(idEnderecoEvento)
    response.status(EnderecoEvento.status_code)
    response.json(EnderecoEvento)
})
