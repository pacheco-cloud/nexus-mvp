// Importa o Pool do 'pg', que gerencia múltiplas conexões
const { Pool } = require('pg');

// Configuração da conexão com o banco de dados PostgreSQL
// Os valores vêm de variáveis de ambiente definidas no docker-compose
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'nexus',
  host: process.env.POSTGRES_HOST || 'database', // 'database' é o nome do serviço no docker-compose
  database: process.env.POSTGRES_DB || 'nexus_mvp',
  password: process.env.POSTGRES_PASSWORD || 'nexus',
  port: 5432,
});

// Exporta uma função para executar queries
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool: pool, // Exportamos o pool para podermos usar transações
};
