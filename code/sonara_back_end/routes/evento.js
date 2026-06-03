const express = require('express')
const cors = require('cors')

const bodyParserJson = express.json()


const controllerEvento = require('../controller/evento/evento')

//configurção do cors 
const router = express.Router()
router.use((request, response, next ) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})




// retornar todos os generos
router.get('/', cors(), async (req, res) => {
    /*
        #swagger.tags = ['Evento']
        #swagger.summary = 'Listar todos os eventos'
        #swagger.description = 'Retorna todos os eventos cadastrados com fotos, endereço e organizador.'
        #swagger.responses[200] = { description: 'Lista de eventos retornada com sucesso' }
        #swagger.responses[404] = { description: 'Nenhum evento encontrado' }
    */
    let evento = await controllerEvento.listarEvento()
    res.status(evento.status_code).json(evento)
})
 
router.get('/:id', cors(), async (req, res) => {
    /*
        #swagger.tags = ['Evento']
        #swagger.summary = 'Buscar evento por ID'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do evento' }
        #swagger.responses[200] = { description: 'Evento encontrado' }
        #swagger.responses[404] = { description: 'Evento não encontrado' }
    */
    let evento = await controllerEvento.buscarEventoId(req.params.id)
    res.status(evento.status_code).json(evento)
})
 
router.post('/', cors(), bodyParserJson, async (req, res) => {
    /*
        #swagger.tags = ['Evento']
        #swagger.summary = 'Criar evento'
        #swagger.description = 'Cria evento com endereço e vínculo ao organizador.'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/EventoCadastro' }
        }
        #swagger.responses[201] = { description: 'Evento criado com sucesso' }
        #swagger.responses[400] = { description: 'Campos obrigatórios ausentes ou inválidos' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' }
    */
    let evento = await controllerEvento.inserirEvento(req.body, req.headers['content-type'])
    res.status(evento.status_code).json(evento)
})
 
router.put('/:id', cors(), bodyParserJson, async (req, res) => {
    /*
        #swagger.tags = ['Evento']
        #swagger.summary = 'Atualizar evento'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do evento' }
        #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/EventoCadastro' } }
        #swagger.responses[200] = { description: 'Evento atualizado com sucesso' }
        #swagger.responses[400] = { description: 'Dados inválidos' }
        #swagger.responses[404] = { description: 'Evento não encontrado' }
    */
    let evento = await controllerEvento.atualizarEvento(req.body, req.params.id, req.headers['content-type'])
    res.status(evento.status_code).json(evento)
})
 
router.delete('/:id', cors(), async (req, res) => {
    /*
        #swagger.tags = ['Evento']
        #swagger.summary = 'Excluir evento'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do evento' }
        #swagger.responses[200] = { description: 'Evento excluído com sucesso' }
        #swagger.responses[404] = { description: 'Evento não encontrado' }
    */
    let evento = await controllerEvento.excluirEvento(req.params.id)
    res.status(evento.status_code).json(evento)
})

module.exports = router