

const  organizadorEventosDAO = require('../../model/DAO/VEWS/evento_fotos.js')
const DEFAULT_MESSAGES = require('../modulo/conf_message.js')



//Retorna um Evento filtrando pelo ID do organizador
const buscarEventoOrganizador = async function(id){
    //Criando um objeto novo para as mensagens
    let MESSAGES = JSON.parse(JSON.stringify(DEFAULT_MESSAGES))

    try {

        //Validação da chegada do ID
        if(!isNaN(id) && id != '' && id != null && id > 0){
            let resultOrganizador = await organizadorEventosDAO.getSelectViewEventOrganizer(Number(id))

            if(resultOrganizador){
                if(resultOrganizador.length > 0){
                    MESSAGES.HEADER.status = MESSAGES.SUCCESS_REQUEST.status
                    MESSAGES.HEADER.status_code = MESSAGES.SUCCESS_REQUEST.status_code
                    MESSAGES.HEADER.response.Organizador = resultOrganizador

                    return MESSAGES.HEADER //200
                }else{
                    return MESSAGES.ERROR_NOT_FOUND //404
                }
            }else{
                return MESSAGES.ERROR_INTERNAL_SERVER_MODEL //500
            }
        }else{
            MESSAGES.ERROR_REQUIRED_FIELDS.message += ' [ID incorreto]'
            return MESSAGES.ERROR_REQUIRED_FIELDS //400
        }

    } catch (error) {
      console.log(error)
    }
}

module.exports = {
    buscarEventoOrganizador
}