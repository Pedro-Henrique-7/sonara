/******************************************************************************
 * Objetivo: Rotas de usuário com upload de foto no cadastro via multer + Azure
 * Data: 19/05/2026
 * Autor: Davi de Alemida Santos
 * Versão: 1.3
*****************************************************************************/

const express    = require('express')
const cors       = require('cors')
const multer     = require('multer')

const { criarToken, authMiddleware } = require('../jwt/conf_jwt')
const controllerUsuario = require('../controller/usuario/usuario')

const router         = express.Router()
const bodyParserJson = express.json()

// Multer em memória — usado no cadastro e no update de foto
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']
        if (tiposPermitidos.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Formato de imagem inválido. Use JPEG, PNG ou WEBP.'))
        }
    }
})

router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    next()
})

// Login
router.post('/login', cors(), bodyParserJson, async (req, res) => {
    /*
        #swagger.tags = ['Usuário']
        #swagger.summary = 'Login de usuário'
        #swagger.description = 'Autentica o usuário e retorna um Bearer Token JWT.'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/UsuarioLogin' }
        }
        #swagger.responses[200] = { description: 'Login realizado com sucesso — retorna token JWT' }
        #swagger.responses[400] = { description: 'E-mail ou senha ausentes' }
        #swagger.responses[401] = { description: 'Credenciais inválidas' }
        #swagger.responses[415] = { description: 'Content-Type deve ser application/json' }
    */
    const contentType = req.headers['content-type']
    if (!contentType || !contentType.toUpperCase().includes('APPLICATION/JSON'))
        return res.status(415).json({ message: 'Content-Type deve ser application/json' })
 
    const { email, senha } = req.body
    if (!email || !senha)
        return res.status(400).json({ message: 'Email e senha são obrigatórios' })
 
    const result = await controllerUsuario.loginUsuario({ email, senha })
    if (result.status_code === 200) {
        const usuario = result.response.usuario
        const token = criarToken(usuario.id_usuario, usuario.role || 'user')
        return res.status(200).json({ status: true, token, usuario })
    }
    return res.status(result.status_code).json(result)
})
 
// Inserir usuário
router.post('/', cors(), upload.single('foto'), async function (request, response) {
    /*
        #swagger.tags = ['Usuário']
        #swagger.summary = 'Cadastrar novo usuário'
        #swagger.description = 'Cria um usuário do tipo artista, organizador ou user. Envie os dados como multipart/form-data com o campo "dados" contendo um JSON e o campo "foto" com a imagem (opcional).'
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['dados'] = {
            in: 'formData',
            type: 'string',
            required: true,
            description: 'JSON stringificado com os dados do usuário (ver UsuarioCadastro)'
        }
        #swagger.parameters['foto'] = {
            in: 'formData',
            type: 'file',
            description: 'Foto do usuário (JPG, PNG ou WEBP, máx 5MB)'
        }
        #swagger.responses[201] = { description: 'Usuário criado com sucesso' }
        #swagger.responses[400] = { description: 'Campos obrigatórios ausentes ou inválidos' }
        #swagger.responses[500] = { description: 'Erro interno ao cadastrar' }
    */
    let dadosBody
    try {
        dadosBody = JSON.parse(request.body.dados)
    } catch (e) {
        return response.status(400).json({ status: false, status_code: 400, message: 'O campo "dados" deve ser um JSON válido' })
    }
    const arquivo = request.file || null
    let resultado = await controllerUsuario.inserirUsuario(dadosBody, arquivo)
    console.log(resultado)
    response.status(resultado.status_code)
    response.json(resultado)
})
 
// Upload/atualização de foto
router.patch('/:id/foto', cors(), upload.single('foto'), async function (request, response) {
    /*
        #swagger.tags = ['Usuário']
        #swagger.summary = 'Atualizar foto do usuário'
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do usuário' }
        #swagger.parameters['foto'] = { in: 'formData', type: 'file', required: true, description: 'Nova foto (JPG, PNG ou WEBP)' }
        #swagger.responses[200] = { description: 'Foto atualizada com sucesso' }
        #swagger.responses[400] = { description: 'Nenhuma imagem enviada' }
        #swagger.responses[404] = { description: 'Usuário não encontrado' }
    */
    const idUsuario = request.params.id
    if (!request.file)
        return response.status(400).json({ status: false, status_code: 400, message: 'Nenhuma imagem enviada. Use o campo "foto" no form-data.' })
 
    const result = await controllerUsuario.atualizarFotoUsuario(idUsuario, request.file.buffer, request.file.originalname, request.file.mimetype)
    response.status(result.status_code)
    response.json(result)
})
 
// Listar usuários
router.get('/', authMiddleware, cors(), async function (request, response) {
    /*
        #swagger.tags = ['Usuário']
        #swagger.summary = 'Listar todos os usuários'
        #swagger.security = [{ bearerAuth: [] }]
        #swagger.responses[200] = { description: 'Lista de usuários retornada com sucesso' }
        #swagger.responses[401] = { description: 'Token ausente ou inválido' }
        #swagger.responses[404] = { description: 'Nenhum usuário encontrado' }
    */
    let usuario = await controllerUsuario.listarUsuarios()
    response.status(usuario.status_code)
    response.json(usuario)
})
 
// Atualizar usuário
router.put('/:id', cors(), upload.single('foto'), async function (request, response) {
    /*
        #swagger.tags = ['Usuário']
        #swagger.summary = 'Atualizar usuário'
        #swagger.consumes = ['multipart/form-data']
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do usuário' }
        #swagger.parameters['dados'] = { in: 'formData', type: 'string', required: true, description: 'JSON com os dados a atualizar' }
        #swagger.parameters['foto'] = { in: 'formData', type: 'file', description: 'Nova foto (opcional)' }
        #swagger.responses[200] = { description: 'Usuário atualizado com sucesso' }
        #swagger.responses[400] = { description: 'Dados inválidos' }
        #swagger.responses[404] = { description: 'Usuário não encontrado' }
    */
    let idUsuario = request.params.id
    let usuario = request.body.dados
    if (typeof usuario === 'string') usuario = JSON.parse(usuario)
    let result = await controllerUsuario.atualizarUsuario(usuario, idUsuario, request.file)
    response.status(result.status_code)
    response.json(result)
})
 
// Deletar usuário
router.delete('/:id', authMiddleware, cors(), async function (request, response) {
    /*
        #swagger.tags = ['Usuário']
        #swagger.summary = 'Excluir usuário'
        #swagger.security = [{ bearerAuth: [] }]
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do usuário' }
        #swagger.responses[200] = { description: 'Usuário excluído com sucesso' }
        #swagger.responses[401] = { description: 'Token ausente ou inválido' }
        #swagger.responses[404] = { description: 'Usuário não encontrado' }
    */
    let idUsuario = request.params.id
    let usuario   = await controllerUsuario.excluirUsuario(idUsuario)
    response.status(usuario.status_code)
    response.json(usuario)
})
 
// Buscar organizador por ID de usuário
router.get('/organizador/:id', cors(), async function (request, response) {
    /*
        #swagger.tags = ['Usuário']
        #swagger.summary = 'Buscar organizador pelo ID do usuário'
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do usuário' }
        #swagger.responses[200] = { description: 'Organizador encontrado' }
        #swagger.responses[404] = { description: 'Organizador não encontrado' }
    */
    let idUsuario = request.params.id
    let usuario   = await controllerUsuario.buscarOrganizadorUsuarioId(idUsuario)
    response.status(usuario.status_code)
    response.json(usuario)
})
 
// Buscar usuário por ID
router.get('/:id', authMiddleware, cors(), async function (request, response) {
    /*
        #swagger.tags = ['Usuário']
        #swagger.summary = 'Buscar usuário por ID'
        #swagger.security = [{ bearerAuth: [] }]
        #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do usuário' }
        #swagger.responses[200] = { description: 'Usuário encontrado' }
        #swagger.responses[401] = { description: 'Token ausente ou inválido' }
        #swagger.responses[404] = { description: 'Usuário não encontrado' }
    */
    let idUsuario = request.params.id
    let usuario   = await controllerUsuario.buscarUsuarioId(idUsuario)
    response.status(usuario.status_code)
    response.json(usuario)
})

module.exports = router
