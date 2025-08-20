# 🚀 Guia Rápido para Engenheiros - Nexus MVP

## ⚡ Quick Start (5 minutos)

```bash
# 1. Clone/Acesse o projeto
cd d:\APPS-Python\no-code-rhyno\nexus-mvp

# 2. Suba os containers
docker-compose -f docker-compose.dev.yml up -d

# 3. Acesse a aplicação
# Frontend: http://localhost:8080
# Backend API: http://localhost:3002

# 4. Para parar
docker-compose -f docker-compose.dev.yml down
```

## 🎯 O que é esta plataforma?

**Nexus MVP** é um **no-code editor** similar ao Bubble.io que permite criar páginas web através de **drag-and-drop visual**.

### **Funcionalidade Principal:**
1. Usuário arrasta componentes (Texto, Input, Botão) para um canvas
2. Edita propriedades (texto, cores, posição) em tempo real
3. Publica a página clicando em "Publicar"
4. Sistema gera HTML/CSS automaticamente
5. Página fica disponível em URL única

---

## 🏗️ Arquitetura em 30 segundos

```
Frontend (Vue.js 3) ←→ API Gateway (Express.js) ←→ Translator (JSON→HTML)
       ↓                        ↓                         ↓
   localhost:8080          localhost:3002            published/*.html
```

**Stack:**
- **Frontend**: Vue.js 3 + Pinia + Vite
- **Backend**: Node.js + Express.js
- **Deploy**: Docker + Docker Compose

---

## 📁 Arquivos Críticos (deve conhecer)

| Arquivo | Responsabilidade | Importância |
|---------|------------------|-------------|
| `editor-frontend/src/App.vue` | Layout principal + função publish | 🔥 CRÍTICO |
| `editor-frontend/src/store/editor.js` | Estado global (Pinia) | 🔥 CRÍTICO |
| `backend/api-gateway/server.js` | API Gateway principal | 🔥 CRÍTICO |
| `backend/api-gateway/translator.js` | JSON → HTML converter | 🔥 CRÍTICO |
| `docker-compose.dev.yml` | Configuração containers | 🔧 IMPORTANTE |

---

## 🧩 Componentes Vue.js

```
App.vue (Root Component)
├── Toolbox.vue       # Sidebar esquerda com botões de componentes
├── Canvas.vue        # Área central de design/edição
│   └── CanvasElement.vue  # Cada elemento individual (draggable)
└── Inspector.vue     # Sidebar direita com propriedades
```

**Fluxo de Dados:**
```
Toolbox → Store.addElement() → Canvas renderiza → CanvasElement aparece
Inspector → Store.updateElement() → Canvas re-renderiza → Elemento atualiza
```

---

## 🔄 API Endpoints

### **POST /publish** 
Recebe elementos do editor e gera página:
```javascript
// Request
{
  "elements": [
    {
      "id": "element_1",
      "type": "text",
      "content": "Hello World",
      "x": 100, "y": 100,
      "width": 200, "height": 50,
      "textColor": "#000000",
      "backgroundColor": "#ffffff"
    }
  ]
}

// Response
{
  "success": true,
  "url": "/published/page-1692547890123"
}
```

### **GET /published/:pageId**
Serve a página HTML gerada

---

## 🛠️ Como Modificar/Extender

### **Adicionar Novo Tipo de Componente:**

1. **Atualizar Toolbox.vue:**
```vue
<button @click="addElement('image')">📷 Imagem</button>
```

2. **Atualizar translator.js:**
```javascript
case 'image':
  return `<img src="${element.src}" style="${style}" alt="${element.alt}" />`;
```

3. **Atualizar store default content:**
```javascript
image: 'https://via.placeholder.com/150'
```

### **Modificar Propriedades do Inspector:**

**Adicionar nova propriedade no Inspector.vue:**
```vue
<label>Nova Propriedade:</label>
<input v-model="selectedElement.newProperty" @input="updateElement">
```

### **Customizar Estilos Gerados:**

**Modificar translator.js para diferentes estilos:**
```javascript
const style = `
  position: absolute;
  left: ${element.x}px;
  top: ${element.y}px;
  /* Adicionar novos estilos aqui */
  border-radius: ${element.borderRadius || 0}px;
  box-shadow: ${element.shadow || 'none'};
`;
```

---

## 🐛 Debugging Rápido

### **Frontend não carrega:**
```bash
docker logs nexus-mvp-nexus-editor-dev-1
# Verificar erros de build ou dependências
```

### **API não responde:**
```bash
docker logs nexus-mvp-nexus-api-gateway-1
# Verificar startup do Express
```

### **Publicação falha:**
```bash
# Verificar logs do backend
docker logs nexus-mvp-nexus-api-gateway-1 -f

# Testar API diretamente
curl -X POST http://localhost:3002/publish -H "Content-Type: application/json" -d '{"elements":[]}'
```

### **Containers não sobem:**
```bash
# Verificar portas ocupadas
netstat -ano | findstr :8080
netstat -ano | findstr :3002

# Rebuild completo
docker-compose -f docker-compose.dev.yml down
docker system prune -f
docker-compose -f docker-compose.dev.yml up --build
```

---

## 🔧 Desenvolvimento

### **Hot Reload:**
- **Frontend**: Salvar arquivo `.vue` ou `.js` → Reload automático
- **Backend**: Nodemon ativo → Restart automático

### **Estrutura de Pastas:**
```
src/
├── components/    # Componentes Vue reutilizáveis
├── store/        # Estado global Pinia
└── main.js       # Bootstrap da aplicação
```

### **Padrões de Código:**
- **Vue Composition API** (setup script)
- **Pinia stores** para estado
- **Computed properties** para reatividade
- **Props/Emits** para comunicação entre componentes

---

## 📈 Performance

### **Otimizações Implementadas:**
- Computed properties para evitar re-renders desnecessários
- Drag & drop nativo (sem bibliotecas pesadas)
- CSS inline para reduzir requisições HTTP
- Docker multi-stage builds

### **Métricas Esperadas:**
- **Load time**: < 2s
- **Drag responsiveness**: 60fps
- **Publish time**: < 500ms
- **Generated page size**: 2-5KB

---

## 🚨 Limitações Conhecidas

1. **Posicionamento**: Apenas absoluto (não responsive)
2. **Componentes**: 4 tipos básicos (text, input, button, group)
3. **Persistência**: Não há banco de dados (apenas runtime)
4. **Usuários**: Sem sistema de autenticação
5. **Versionamento**: Sem histórico/undo

---

## 🔮 Próximos Passos (Roadmap)

### **MVP+1 (Próxima Sprint):**
- [ ] Componente Image
- [ ] Undo/Redo básico
- [ ] Templates pré-definidos

### **MVP+2:**
- [ ] Responsive design
- [ ] Banco de dados (PostgreSQL)
- [ ] Sistema de usuários

### **MVP+3:**
- [ ] Marketplace de componentes
- [ ] Export de código
- [ ] Workflow engine

---

## 💡 Dicas para Novos Desenvolvedores

### **Primeiro Commit:**
1. Configure o ambiente local
2. Faça uma mudança simples (ex: cor de botão)
3. Teste o hot reload
4. Entenda o fluxo de dados

### **Debugging Mental Model:**
```
Problema no Visual → Verificar Vue DevTools → Checar Store State
Problema na API → Verificar Network Tab → Checar Backend Logs
Problema no Docker → Verificar docker ps → Rebuildar containers
```

### **Code Review Checklist:**
- [ ] Hot reload funcionando?
- [ ] Quebrou alguma funcionalidade existente?
- [ ] Código seguindo padrões Vue 3?
- [ ] Documentação atualizada se necessário?

---

## 📞 Suporte Técnico

### **Problemas Comuns:**

**"Port already in use":**
```bash
# Matar processo na porta
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**"Cannot connect to Docker daemon":**
- Verificar se Docker Desktop está rodando
- Restart Docker Desktop se necessário

**"Module not found":**
```bash
# Rebuild containers
docker-compose -f docker-compose.dev.yml build --no-cache
```

---

*Para dúvidas específicas, consulte os logs dos containers e a documentação técnica completa.*
