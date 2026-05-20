/******************************************************************************
 * Objetivo: Rota de foto de evento com multer para receber multipart/form-data
 * Data: 19/05/2026
 * Versão: 2.0
 *****************************************************************************/

const express    = require('express')
const cors       = require('cors')
const multer     = require('multer')
const router     = express.Router()

const controllerEventoFoto = require('../controller/evento_foto/evento_foto')

// Multer em memória — buffer vai direto para o Azure
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const permitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (permitidos.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Tipo não permitido. Use JPG, PNG ou WEBP.'), false)
        }
    }
})

router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// GET todos
router.get('/', cors(), async function (request, response) {
    let EventoFoto = await controllerEventoFoto.listareventoFoto()
    response.status(EventoFoto.status_code).json(EventoFoto)
})

// GET por id
router.get('/:id', cors(), async function (request, response) {
    let EventoFoto = await controllerEventoFoto.buscareventoFotoId(request.params.id)
    response.status(EventoFoto.status_code).json(EventoFoto)
})

// POST — multipart/form-data com campo "foto" (arquivo) + "evento_id"
router.post('/', cors(), upload.single('foto'), async function (request, response) {
    let EventoFoto = await controllerEventoFoto.inserireventoFoto(
        request.body,   // { evento_id }
        request.file    // arquivo do multer (buffer, originalname, mimetype)
    )
    response.status(EventoFoto.status_code).json(EventoFoto)
})

// PUT — novo arquivo é opcional
router.put('/:id', cors(), upload.single('foto'), async function (request, response) {
    let EventoFoto = await controllerEventoFoto.atualizareventoFoto(
        request.body,
        request.params.id,
        request.file
    )
    response.status(EventoFoto.status_code).json(EventoFoto)
})

// DELETE
router.delete('/:id', cors(), async function (request, response) {
    let EventoFoto = await controllerEventoFoto.excluireventoFoto(request.params.id)
    response.status(EventoFoto.status_code).json(EventoFoto)
})

module.exports = router