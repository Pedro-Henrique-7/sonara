const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerOrganizador = require('../controller/organizador/organozador')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// ENDPOINTS DA TABELA Organizador


// retornar todos os Organizadors
router.get('/', cors(), async function (request, response){

    /*  #swagger.tags = ['Organizador']
    #swagger.summary = 'Listar todos os organizadores'
    #swagger.responses[200] = { description: 'Lista retornada com sucesso' }
    #swagger.responses[404] = { description: 'Nenhum organizador encontrado' } */

  let organizador  = await controllerOrganizador.listarOrganizador()
    
    response.status(organizador.status_code)
    response.json(organizador)
})
module.exports = router 


// pegar Organizador por id
router.get('/:id', cors(), async function (request, response){

    /*  #swagger.tags = ['Organizador']
    #swagger.summary = 'Buscar organizador por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do organizador' }
    #swagger.responses[200] = { description: 'Organizador encontrado' }
    #swagger.responses[404] = { description: 'Organizador não encontrado' } */

    let idOrganizador = request.params.id

    let organizador = await controllerOrganizador.buscarOrganizadorId(idOrganizador)
    response.status(organizador.status_code)
    response.json(organizador)  
})


//inserir Organizador
router.post('/', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Organizador']
    #swagger.summary = 'Cadastrar organizador'
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Organizador' } }
    #swagger.responses[201] = { description: 'Organizador criado' }
    #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let organizador = await controllerOrganizador.inserirOrganizador(dadosBody, contentType)

    response.status(organizador.status_code)
    response.json(organizador)
})


router.put('/:id', cors(), bodyParserJson, async function(request, response) {

    /*  #swagger.tags = ['Organizador']
    #swagger.summary = 'Atualizar organizador'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do organizador' }
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/Organizador' } }
    #swagger.responses[200] = { description: 'Organizador atualizado' }
    #swagger.responses[404] = { description: 'Organizador não encontrado' } */
    let dadosBody = request.body
    
    let idOrganizador = request.params.id

    let contentType = request.headers['content-type']

    let organizador = await controllerOrganizador.atualizarOrganizador(dadosBody, idOrganizador, contentType)
    response.status(organizador.status_code)
    response.json(organizador)
})

router.delete('/:id', cors(), async function(request, response) {
    /*  #swagger.tags = ['Organizador']
    #swagger.summary = 'Excluir organizador'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do organizador' }
    #swagger.responses[200] = { description: 'Organizador excluído' }
    #swagger.responses[404] = { description: 'Organizador não encontrado' } */
    let idOrganizador = request.params.id

    let organizador = await controllerOrganizador.excluirOrganizador(idOrganizador)
    response.status(organizador.status_code)
    response.json(organizador)
})
