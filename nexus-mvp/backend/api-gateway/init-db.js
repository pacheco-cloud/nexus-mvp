const db = require('./db');

async function initializeDatabase() {
  console.log('🔄 [Database] Verificando e inicializando tabelas (v2)...');
  
  try {
    // Tabela para guardar os projetos (sem alterações)
    await db.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // NOVA: Tabela para guardar as páginas de cada projeto
    await db.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        path VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, name)
      );
    `);

    // Tabela para guardar os elementos de cada projeto (mantida para compatibilidade)
    await db.query(`
      CREATE TABLE IF NOT EXISTS elements (
        id VARCHAR(255) PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        position JSONB NOT NULL,
        properties JSONB NOT NULL
      );
    `);

    // ATUALIZADA: A tabela elements agora referencia uma página
    await db.query(`
      ALTER TABLE elements
        ADD COLUMN IF NOT EXISTS page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE;
    `);

    // MIGRAÇÃO: Torna o campo 'path' opcional se já existir
    await db.query(`
      ALTER TABLE pages 
        ALTER COLUMN path DROP NOT NULL;
    `).catch(() => {
      // Ignora erro se a coluna já for opcional
      console.log('⚠️ [Database] Campo path já é opcional ou não existe');
    });

    // MIGRAÇÃO: Remove constraint UNIQUE em path se existir, adiciona em name
    await db.query(`
      ALTER TABLE pages 
        DROP CONSTRAINT IF EXISTS pages_project_id_path_key;
    `).catch(() => {
      // Ignora erro se constraint não existir
    });

    await db.query(`
      ALTER TABLE pages 
        ADD CONSTRAINT pages_project_id_name_key UNIQUE (project_id, name);
    `).catch(() => {
      // Ignora erro se constraint já existir
      console.log('⚠️ [Database] Constraint UNIQUE em name já existe');
    });

    console.log('✅ [Database] Tabelas v2 verificadas/criadas com sucesso!');
  } catch (err) {
    console.error('❌ [Database] Erro ao inicializar o banco de dados:', err.stack);
    process.exit(1);
  }
}

module.exports = initializeDatabase;
