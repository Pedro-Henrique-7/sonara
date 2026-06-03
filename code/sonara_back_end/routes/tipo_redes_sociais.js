const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerTipoRedesSociais = require('../controller/tipo_redes_sociais/tipos_redes_sociais')

//configurção do cors 
const router = express.Router()
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})




// retornar todos os TipoRedesSociaiss
router.get('/', cors(), async function (request, response) {
    /*  #swagger.tags = ['Tipo Redes Sociais']
        #swagger.summary = 'Listar tipos de redes sociais'
        #swagger.responses[200] = { description: 'Lista retornada' } */
    let TipoRedesSociais = await controllerTipoRedesSociais.listarTipoRedesSociais()

    response.status(TipoRedesSociais.status_code)
    response.json(TipoRedesSociais)
})
module.exports = router


// pegar TipoRedesSociais por id
router.get('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Tipo Redes Sociais']
    #swagger.summary = 'Buscar tipo de rede social por ID'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Encontrado' }
    #swagger.responses[404] = { description: 'Não encontrado' } */
    let idTipoRedesSociais = request.params.id

    let TipoRedesSociais = await controllerTipoRedesSociais.buscarTipoRedesSociaisId(idTipoRedesSociais)
    response.status(TipoRedesSociais.status_code)
    response.json(TipoRedesSociais)


})


//inserir TipoRedesSociais
router.post('/', cors(), bodyParserJson, async function (request, response) {

    /*  #swagger.tags = ['Tipo Redes Sociais']
        #swagger.summary = 'Cadastrar tipo de rede social'
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/TipoRedesSociais' } }
        #swagger.responses[201] = { description: 'Tipo criado' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' } */
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let TipoRedesSociais = await controllerTipoRedesSociais.inserirTipoRedesSociais(dadosBody, contentType)

    response.status(TipoRedesSociais.status_code)
    response.json(TipoRedesSociais)
})


router.put('/:id', cors(), bodyParserJson, async function (request, response) {
    /*  #swagger.tags = ['Tipo Redes Sociais']
    #swagger.summary = 'Atualizar tipo de rede social'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/TipoRedesSociais' } }
    #swagger.responses[200] = { description: 'Atualizado' } */

    let dadosBody = request.body

    let idTipoRedesSociais = request.params.id

    let contentType = request.headers['content-type']

    let TipoRedesSociais = await controllerTipoRedesSociais.atualizarTipoRedesSociais(dadosBody, idTipoRedesSociais, contentType)
    response.status(TipoRedesSociais.status_code)
    response.json(TipoRedesSociais)
})

router.delete('/:id', cors(), async function (request, response) {
    /*  #swagger.tags = ['Tipo Redes Sociais']
    #swagger.summary = 'Excluir tipo de rede social'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    #swagger.responses[200] = { description: 'Excluído' } */
    let idTipoRedesSociais = request.params.id

    let TipoRedesSociais = await controllerTipoRedesSociais.excluirTipoRedesSociais(idTipoRedesSociais)
    response.status(TipoRedesSociais.status_code)
    response.json(TipoRedesSociais)
})
