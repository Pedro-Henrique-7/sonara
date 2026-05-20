const knex = require('knex')
const knexConfig = require('../../database_conf/knex')

const knexDatabase = knex(knexConfig.development)

const getSelectViewUserPerfil = async function(){
    try {
        let sql = `SELECT * FROM vw_usuario_perfil`
        let result = await knexDatabase.raw(sql)

        if(Array.isArray(result[0]))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectViewUserPerfil
}
