const express = require('express');
const cors = require('cors');
const fs = require('fs'); // Módulo de sistema de arquivos do Node.js
const path = require('path'); // Módulo para lidar com caminhos de arquivos
const { generateHTML, generateCSS } = require('./translator'); // Importa nosso tradutor

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

// Rota principal de publicação
app.post('/publish', (req, res) => {
  console.log('✅ [API Gateway] Rota /publish alcançada!');
  const pageElements = req.body;

  // 2. Usa o tradutor para gerar o conteúdo
  const htmlContent = generateHTML(pageElements);
  const cssContent = generateCSS(pageElements);

  // 3. Salva os arquivos gerados na pasta 'published'
  const pageId = `page-${Date.now()}`;
  const pageDir = path.join(publishedDir, pageId);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir);
  }
  fs.writeFileSync(path.join(pageDir, 'index.html'), htmlContent);
  fs.writeFileSync(path.join(pageDir, 'style.css'), cssContent);

  console.log(`📝 Página gerada e salva em: ${pageDir}`);
  
  // 4. Retorna a URL real e funcional
  const publicUrl = `http://localhost:3002/${pageId}/`;
  
  res.status(200).json({ 
    message: 'Página publicada com sucesso!',
    url: publicUrl 
  });
});

app.listen(port, () => {
  console.log(`🚀 [API Gateway] Servidor rodando na porta ${port}`);
});
