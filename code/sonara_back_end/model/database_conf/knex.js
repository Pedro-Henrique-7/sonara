const env = process.env;
module.exports = {
  development: {
    client: 'mysql2',

    connection: {
      host: env.MYSQL_HOST,
      user: env.MYSQL_USER,
      password: env.MYSQL_PASSWORD,
      database: env.MYSQL_DATABASE,
      port: 3306,
      charset: 'utf8mb4',

      ssl: {
        rejectUnauthorized: false
      }
    },

    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations'
    },

    seeds: {
      directory: './db/seeds'
    },

     pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 60000,
      createTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100
    }
  },
};