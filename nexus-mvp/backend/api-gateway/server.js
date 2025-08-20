const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Módulo de sistema de arquivos do Node.js
const path = require('path'); // Módulo para lidar com caminhos de arquivos
const { generateHTML, generateCSS, generateJS } = require('./translator'); // Importa nosso tradutor
const db = require('./db'); // Importa configuração do banco de dados
const initializeDatabase = require('./init-db'); // Importa inicializador do banco

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 1. Cria uma pasta 'published' e a serve estaticamente
const publishedDir = path.join(__dirname, 'published');
if (!fs.existsSync(publishedDir)) {
  fs.mkdirSync(publishedDir);
}
app.use(express.static(publishedDir)); // Qualquer arquivo em 'published' será acessível publicamente

// --- NOVOS ENDPOINTS CRUD PARA PROJETOS ---

// Endpoint para LISTAR todos os projetos
app.get('/projects', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, created_at FROM projects ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ Erro ao listar projetos:', err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Endpoint para CRIAR um novo projeto
app.post('/projects', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O nome do projeto é obrigatório.' });
  }
  
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Criar o projeto
    const projectResult = await client.query('INSERT INTO projects (name) VALUES ($1) RETURNING *', [name]);
    const project = projectResult.rows[0];
    
    // 2. Criar automaticamente a página "home" padrão
    const pageResult = await client.query(
      'INSERT INTO pages (project_id, name, path) VALUES ($1, $2, $3) RETURNING *', 
      [project.id, 'home', '/']
    );
    
    await client.query('COMMIT');
    
    console.log(`✅ Projeto criado com sucesso: ID ${project.id}`);
    console.log(`✅ Página 'home' criada automaticamente para o projeto ID ${project.id}`);
    
    // Retorna o projeto com a página home incluída
    res.status(201).json({
      ...project,
      defaultPageId: pageResult.rows[0].id
    });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao criar projeto:', err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
  } finally {
    client.release();
  }
});

// Endpoint para CARREGAR um projeto existente e seus elementos
app.get('/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Busca os detalhes do projeto
    const projectResult = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (projectResult.rows.length === 0) {
      return res.status(404).json({ message: 'Projeto não encontrado.' });
    }
    // Busca os elementos associados
    const elementsResult = await db.query('SELECT * FROM elements WHERE project_id = $1', [id]);
    
    const projectData = {
      ...projectResult.rows[0],
      elements: elementsResult.rows, // Anexa os elementos ao objeto do projeto
    };
    
    res.status(200).json(projectData);
  } catch (err) {
    console.error(`❌ Erro ao carregar projeto ${id}:`, err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Endpoint para SALVAR (atualizar) os elementos de um projeto
app.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { elements } = req.body; // Espera receber um array de elementos

  if (!elements || !Array.isArray(elements)) {
    return res.status(400).json({ message: 'Um array de elementos é obrigatório.' });
  }

  // Usamos uma transação para garantir a integridade dos dados
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    // 1. Deleta os elementos antigos
    await client.query('DELETE FROM elements WHERE project_id = $1', [id]);
    // 2. Insere os novos elementos
    for (const el of elements) {
      const { id: elId, type, position, properties } = el;
      await client.query(
        'INSERT INTO elements (id, project_id, type, position, properties) VALUES ($1, $2, $3, $4, $5)',
        [elId, id, type, position, properties]
      );
    }
    await client.query('COMMIT');
    console.log(`✅ Projeto ID ${id} salvo com sucesso com ${elements.length} elementos.`);
    res.status(200).json({ message: 'Projeto salvo com sucesso!' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`❌ Erro ao salvar projeto ${id}:`, err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
  } finally {
    client.release();
  }
});

// --- NOVOS ENDPOINTS CRUD PARA PÁGINAS ---

// Endpoint para LISTAR todas as páginas de um projeto
app.get('/projects/:projectId/pages', async (req, res) => {
  const { projectId } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM pages WHERE project_id = $1 ORDER BY created_at ASC', [projectId]);
    res.status(200).json(rows);
  } catch (err) {
    console.error(`❌ Erro ao listar páginas do projeto ${projectId}:`, err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Endpoint para CRIAR uma nova página
app.post('/projects/:projectId/pages', async (req, res) => {
  const { projectId } = req.params;
  const { name } = req.body;
  // Gera um 'path' amigável para URL (ex: "Página Inicial" -> "pagina-inicial")
  const path = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  if (!name) {
    return res.status(400).json({ message: 'O nome da página é obrigatório.' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO pages (project_id, name, path) VALUES ($1, $2, $3) RETURNING *',
      [projectId, name, path]
    );
    console.log(`✅ Página '${name}' criada para o projeto ID ${projectId}`);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(`❌ Erro ao criar página para o projeto ${projectId}:`, err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Endpoint para CARREGAR os elementos de uma página específica
app.get('/pages/:pageId/elements', async (req, res) => {
  const { pageId } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM elements WHERE page_id = $1', [pageId]);
    res.status(200).json(rows);
  } catch (err) {
    console.error(`❌ Erro ao carregar elementos da página ${pageId}:`, err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Endpoint para SALVAR os elementos de uma página
app.put('/pages/:pageId/elements', async (req, res) => {
  const { pageId } = req.params;
  const { elements } = req.body;

  if (!elements || !Array.isArray(elements)) {
    return res.status(400).json({ message: 'Um array de elementos é obrigatório.' });
  }

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM elements WHERE page_id = $1', [pageId]);
    for (const el of elements) {
      await client.query(
        'INSERT INTO elements (id, project_id, page_id, type, position, properties) VALUES ($1, $2, $3, $4, $5, $6)',
        [el.id, el.project_id, pageId, el.type, el.position, el.properties]
      );
    }
    await client.query('COMMIT');
    console.log(`✅ Elementos da página ID ${pageId} salvos com sucesso.`);
    res.status(200).json({ message: 'Página salva com sucesso!' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`❌ Erro ao salvar página ${pageId}:`, err.stack);
    res.status(500).json({ message: 'Erro interno do servidor' });
  } finally {
    client.release();
  }
});

// Rota principal de publicação
app.post('/publish', (req, res) => {
  console.log('✅ [API Gateway] Rota /publish alcançada!');
  const pageElements = req.body;

  // 2. Usa o tradutor para gerar o conteúdo
  const htmlContent = generateHTML(pageElements);
  const cssContent = generateCSS(pageElements);
  const jsContent = generateJS(pageElements); // ADICIONE ESTA LINHA

  // 3. Salva os arquivos gerados na pasta 'published'
  const pageId = `page-${Date.now()}`;
  const pageDir = path.join(publishedDir, pageId);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir);
  }
  fs.writeFileSync(path.join(pageDir, 'index.html'), htmlContent);
  fs.writeFileSync(path.join(pageDir, 'style.css'), cssContent);
  fs.writeFileSync(path.join(pageDir, 'script.js'), jsContent); // ADICIONE ESTA LINHA

  console.log(`📝 Página gerada e salva em: ${pageDir}`);
  
  // 4. Retorna a URL real e funcional
  const publicUrl = `http://localhost:3002/${pageId}/`;
  
  res.status(200).json({ 
    message: 'Página publicada com sucesso!',
    url: publicUrl 
  });
});

// Função para iniciar o servidor
async function startServer() {
  await initializeDatabase(); // Inicializa o banco de dados primeiro
  
  app.listen(port, () => {
    console.log(`🚀 [API Gateway] Servidor rodando na porta ${port}`);
  });
}

startServer(); // Executa a função de inicialização
