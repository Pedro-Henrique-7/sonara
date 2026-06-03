const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerEndereco = require('../controller/endereco/endereco')

//configurção do cors 
const router = express.Router()
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// ENDPOINTS DA TABELA endereco


// retornar todos os enderecos
router.get('/', cors(), async function (request, response) {
    /*  #swagger.tags = ['Endereco']
        #swagger.summary = 'Listar todos os endereços'
        #swagger.responses[200] = { description: 'Lista retornada' } */
    let endereco = await controllerEndereco.listarEnderecos()

    response.status(endereco.status_code)
    response.json(endereco)
})
module.exports = router


// pegar endereco por id
router.get('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Endereco']
    #swagger.summary = 'Buscar endereço por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Endereço encontrado' }
    #swagger.responses[404] = { description: 'Não encontrado' } */
    let idEndereco = request.params.id

    let endereco = await controllerEndereco.buscarEnderecoId(idEndereco)
    response.status(endereco.status_code)
    response.json(endereco)


})


//inserir endereco
router.post('/', cors(), bodyParserJson, async function (request, response) {
    /*  #swagger.tags = ['Endereco']
        #swagger.summary = 'Cadastrar endereço'
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Endereco' } }
        #swagger.responses[201] = { description: 'Endereço criado' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */

    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let endereco = await controllerEndereco.inserirEndereco(dadosBody, contentType)

    response.status(endereco.status_code)
    response.json(endereco)
})


router.put('/:id', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Endereco']
    #swagger.summary = 'Atualizar endereço'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Endereco' } }
    #swagger.responses[200] = { description: 'Endereço atualizado' } */
    let dadosBody = request.body

    let idEndereco = request.params.id

    let contentType = request.headers['content-type']

    let endereco = await controllerEndereco.atualizarEndereco(dadosBody, idEndereco, contentType)
    response.status(endereco.status_code)
    response.json(endereco)
})

router.delete('/:id', cors(), async function (request, response) {

    /*  #swagger.tags = ['Endereco']
    #swagger.summary = 'Excluir endereço'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Endereço excluído' } */
    let idEndereco = request.params.id

    let endereco = await controllerEndereco.excluirEndereco(idEndereco)
    response.status(endereco.status_code)
    response.json(endereco)
})
