const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerRedesSociais = require('../controller/redes_sociais/redes_sociais')

//configurção do cors 
const router = express.Router()
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})




// retornar todos os RedesSociaiss
router.get('/', cors(), async function (request, response) {
    /*  #swagger.tags = ['Redes Sociais']
        #swagger.summary = 'Listar redes sociais'
        #swagger.responses[200] = { description: 'Lista retornada' } */
    let RedesSociais = await controllerRedesSociais.listarRedesSociaiss()

    response.status(RedesSociais.status_code)
    response.json(RedesSociais)
})
module.exports = router


// pegar RedesSociais por id
router.get('/:id', cors(), async function (request, response) {

    /*  #swagger.tags = ['Redes Sociais']
    #swagger.summary = 'Buscar rede social por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Encontrada' }
    #swagger.responses[404] = { description: 'Não encontrada' } */
    let idRedesSociais = request.params.id

    let RedesSociais = await controllerRedesSociais.buscarRedesSociaisId(idRedesSociais)
    response.status(RedesSociais.status_code)
    response.json(RedesSociais)


})


//inserir RedesSociais
router.post('/', cors(), bodyParserJson, async function (request, response) {
    /*  #swagger.tags = ['Redes Sociais']
        #swagger.summary = 'Cadastrar rede social'
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/RedesSociais' } }
        #swagger.responses[201] = { description: 'Rede social criada' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */

    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let RedesSociais = await controllerRedesSociais.inserirRedesSociais(dadosBody, contentType)

    response.status(RedesSociais.status_code)
    response.json(RedesSociais)
})


router.put('/:id', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Redes Sociais']
    #swagger.summary = 'Atualizar rede social'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/RedesSociais' } }
    #swagger.responses[200] = { description: 'Atualizada' } */
    let dadosBody = request.body

    let idRedesSociais = request.params.id

    let contentType = request.headers['content-type']

    let RedesSociais = await controllerRedesSociais.atualizarRedesSociais(dadosBody, idRedesSociais, contentType)
    response.status(RedesSociais.status_code)
    response.json(RedesSociais)
})

router.delete('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Redes Sociais']
    #swagger.summary = 'Excluir rede social'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Excluída' } */
    let idRedesSociais = request.params.id

    let RedesSociais = await controllerRedesSociais.excluirRedesSociais(idRedesSociais)
    response.status(RedesSociais.status_code)
    response.json(RedesSociais)
})
