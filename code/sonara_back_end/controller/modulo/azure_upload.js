/*********************************************************************************************
 * Objetivo: Módulo responsável pelo upload de imagens para o Azure Blob Storage
 * Data: 19/05/2026
 * Autor: Pedro Henrique
 * Versão: 1.0
 **********************************************************************************************/

const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob')
const azureConfig = require('./conf_azure.js')
const path = require('path')
const { v4: uuidv4 } = require('uuid')

/**
 * Faz upload de um arquivo para o Azure Blob Storage
 * @param {Buffer} fileBuffer - conteúdo do arquivo em buffer
 * @param {string} originalName - nome original do arquivo
 * @param {string} mimeType - tipo do arquivo (ex: image/jpeg)
 * @returns {string|false} URL pública do arquivo ou false em caso de erro
 */
const uploadImagemAzure = async function (fileBuffer, originalName, mimeType) {
    try {
        const ext = path.extname(originalName)
        const blobName = `${uuidv4()}${ext}`

        const blobUrl = `https://${azureConfig.ACCOUNT}.blob.core.windows.net/${azureConfig.CONTAINER}/${blobName}?${azureConfig.TOKEN}`

        const response = await fetch(blobUrl, {
            method: 'PUT',
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': mimeType,
                'Content-Length': fileBuffer.length
            },
            body: fileBuffer
        })

        if (response.ok) {
            // Retorna a URL sem o token SAS (acesso público via token do container)
            const urlPublica = `https://${azureConfig.ACCOUNT}.blob.core.windows.net/${azureConfig.CONTAINER}/${blobName}?${azureConfig.TOKEN}`
            return urlPublica
        } else {
            console.log('Erro Azure:', response.status, await response.text())
            return false
        }

    } catch (error) {
        console.log('Erro ao fazer upload para Azure:', error)
        return false
    }
}

module.exports = { uploadImagemAzure }