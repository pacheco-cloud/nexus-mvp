# 🚀 Nexus MVP - Plataforma No-Code Multi-Página

> **Uma plataforma no-code moderna e escalável para criação de websites completos com múltiplas páginas, desenvolvida com Vue.js 3, Node.js e PostgreSQL**

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Arquitetura](#-arquitetura)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Configuração e Execução](#-configuração-e-execução)
- [Sistema Multi-Página](#-sistema-multi-página)
- [Sistema de Auto-Save](#-sistema-de-auto-save)
- [API Endpoints](#-api-endpoints)
- [Desenvolvimento](#-desenvolvimento)

---

## 🎯 Visão Geral

O **Nexus MVP** é uma plataforma no-code que permite aos usuários criar websites completos com múltiplas páginas através de uma interface visual intuitiva de arrastar e soltar (drag-and-drop), sem necessidade de conhecimento em programação.

## ✨ Funcionalidades Principais

### 🏠 **Gestão de Projetos e Páginas**
- **Múltiplas Páginas**: Cada projeto pode ter várias páginas
- **Página Home Automática**: Novos projetos são criados com uma página "home" por padrão
- **Navegação Visual**: Interface intuitiva para gerenciar páginas
- **Dashboard de Projetos**: Visão geral de todos os projetos

### 🎨 **Editor Visual Avançado**
- **Drag & Drop**: Componentes arrastáveis e posicionáveis
- **Sistema Responsivo**: Elementos se adaptam automaticamente a diferentes tamanhos de tela
- **Preview em Tempo Real**: Modo preview sem ferramentas de edição
- **Inspetor de Propriedades**: Edição detalhada de cada elemento

### 💾 **Sistema de Auto-Save Inteligente**
- **Save Automático**: Salvamento automático a cada 2 segundos
- **Controle Manual**: Toggle para ativar/desativar auto-save
- **Feedback Visual**: Indicadores de "Saving..." e "Saved"
- **Save Manual**: Botão de save manual quando auto-save está desabilitado
- **Confirmação de Saída**: Alerta antes de sair sem salvar

### 🔧 **Elementos Disponíveis**
- **Text**: Textos editáveis com formatação
- **Button**: Botões customizáveis 
- **Image**: Imagens com controle de tamanho
- **Container**: Containers para organização
- **Heading**: Títulos hierárquicos (H1-H6)

### Características Técnicas:
- **Arquitetura Microsserviços**: Backend modular com PostgreSQL
- **Containerização**: Deploy simplificado com Docker
- **Sistema Responsivo**: Adaptação automática para mobile/desktop
- **API RESTful**: Comunicação eficiente entre frontend e backend

---

## 🏗️ Arquitetura

```
┌─────────────────┐    HTTP/JSON    ┌─────────────────┐    SQL Queries    ┌─────────────────┐
│                 │  ──────────────> │                 │  ──────────────>  │                 │
│   Frontend      │                 │   API Gateway   │                   │   PostgreSQL    │
│   Vue.js 3      │  <────────────── │   Express.js    │  <──────────────  │   Database      │
│   + Pinia       │    JSON API     │   + Multi-Page  │    Data Storage   │   + Multi-Page  │
└─────────────────┘                 └─────────────────┘                   └─────────────────┘
       │                                       │                                     │
       │                                       │                                     │
       v                                       v                                     v
┌─────────────────┐                 ┌─────────────────┐                   ┌─────────────────┐
│   Components    │                 │     Docker      │                   │     Tables      │
│   • Canvas      │                 │   Containers    │                   │   • projects    │
│   • Toolbox     │                 │   • Frontend    │                   │   • pages       │
│   • Inspector   │                 │   • Backend     │                   │   • elements    │
│   • PagesPanel  │                 │   • Database    │                   │   (Relational)  │
└─────────────────┘                 └─────────────────┘                   └─────────────────┘
```

### **Tecnologias Core:**
- **Frontend**: Vue.js 3 + Composition API + Pinia
- **Backend**: Node.js + Express.js + PostgreSQL
- **Infrastructure**: Docker + Docker Compose
- **Database**: PostgreSQL 14 com relacionamentos
- **Communication**: RESTful API + JSON

---

## 📁 Estrutura do Projeto

```
nexus-mvp/
├── 📁 backend/
│   └── 📁 api-gateway/
│       ├── 📄 server.js           # API principal com endpoints multi-página
│       ├── 📄 translator.js       # Engine de tradução JSON → HTML/CSS responsivo
│       ├── 📄 db.js               # Configuração PostgreSQL
│       ├── 📄 init-db.js          # Schema e migrações do banco
│       ├── 📄 package.json        # Dependências do backend
│       └── 📄 Dockerfile          # Container do backend
│
├── 📁 editor-frontend/
│   ├── 📁 src/
│   │   ├── 📄 App.vue             # Componente raiz com navegação e auto-save
│   │   ├── 📄 main.js             # Configuração Vue.js + Pinia
│   │   ├── 📁 components/
│   │   │   ├── 📄 ProjectsDashboard.vue  # Dashboard inicial de projetos
│   │   │   ├── 📄 PagesPanel.vue         # Gestão visual de páginas
│   │   │   ├── 📄 Toolbox.vue            # Paleta de componentes + painel páginas
│   │   │   ├── 📄 Canvas.vue             # Editor drag-drop + preview mode
│   │   │   ├── 📄 Inspector.vue          # Painel de propriedades
│   │   │   └── 📄 CanvasElement.vue      # Elemento individual responsivo
│   │   ├── 📁 store/
│   │   │   └── 📄 editor.js              # Estado global com auto-save e multi-página
│   │   ├── 📁 composables/
│   │   │   └── 📄 useResponsive.js       # Sistema de responsividade
│   │   └── 📁 utils/
│   │       └── 📄 translator.js          # Utilities para tradução
│   ├── 📄 package.json            # Dependências Vue.js
│   ├── 📄 vite.config.js          # Configuração Vite
│   ├── 📄 Dockerfile.dev          # Container desenvolvimento
│   └── 📄 index.html              # Template HTML
│
├── 📄 docker-compose.dev.yml      # Orquestração dos containers
├── 📄 README.md                   # Documentação principal
├── 📄 PROJECT_STRUCTURE.md        # Estrutura detalhada
├── 📄 TECHNICAL_DOCS.md           # Documentação técnica
└── 📄 ENGINEER_GUIDE.md           # Guia para desenvolvedores
```

##  Tecnologias Utilizadas

### **Frontend:**
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Vue.js 3** | ^3.4.21 | Framework reativo com Composition API |
| **Pinia** | ^2.1.7 | Gerenciamento de estado global |
| **Vite** | ^5.2.0 | Build tool e dev server |
| **@vueuse/core** | ^10.9.0 | Utilitários composables |

### **Backend:**
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | 18-alpine | Runtime JavaScript |
| **Express.js** | ^4.19.2 | Framework web API |
| **PostgreSQL** | 14 | Banco de dados relacional |
| **CORS** | ^2.8.5 | Cross-Origin Resource Sharing |

### **DevOps:**
| Tecnologia | Propósito |
|------------|-----------|
| **Docker** | Containerização de aplicações |
| **Docker Compose** | Orquestração multi-container |

## 🚀 Configuração e Execução

### **Pré-requisitos:**
- Docker e Docker Compose instalados
- Portas 5173 (frontend), 3000 (backend), 5432 (postgres) disponíveis

### **Execução:**
```bash
# Clone o repositório
git clone [repo-url]
cd nexus-mvp

# Iniciar todos os serviços
docker-compose -f docker-compose.dev.yml up

# Acesso:
# Frontend: http://localhost:8080
# Backend API: http://localhost:3002
```

## 🏠 Sistema Multi-Página

### **Estrutura do Banco de Dados:**
```sql
projects (id, name, created_at)
    ↓ 1:N
pages (id, project_id, name, path, created_at)
    ↓ 1:N  
elements (id, page_id, type, properties, position, created_at)
```

### **Funcionalidades:**
- ✅ **Criação Automática**: Novos projetos ganham página "home" automaticamente
- ✅ **Gestão Visual**: PagesPanel para criar, navegar e gerenciar páginas
- ✅ **Navegação Intuitiva**: Clique para trocar entre páginas
- ✅ **URL Paths**: Cada página tem seu path único (/, /about, /contact, etc.)
- ✅ **Cascading Deletes**: Exclusão de projeto remove todas as páginas e elementos

### **Fluxo de Uso:**
1. **Criar Projeto** → Página "home" criada automaticamente
2. **Adicionar Páginas** → Usar botão "+" no PagesPanel
3. **Editar Conteúdo** → Arrastar elementos, editar propriedades
4. **Navegar** → Clicar nas páginas para trocar contexto

## 💾 Sistema de Auto-Save

### **Características:**
- ✅ **Auto-Save Inteligente**: Salva automaticamente a cada 2 segundos
- ✅ **Toggle de Controle**: Ativar/desativar conforme necessidade
- ✅ **Feedback Visual**: "Saving..." e "Saved" para feedback imediato
- ✅ **Save Manual**: Botão manual quando auto-save desabilitado
- ✅ **Confirmação de Saída**: Alerta antes de perder trabalho não salvo

### **Estados do Sistema:**
```javascript
// Auto-Save Ativo
autoSaveEnabled: true
- Salva automaticamente mudanças
- Botão mostra "🔄 Auto"
- Save manual oculto

// Save Manual
autoSaveEnabled: false  
- Usuário controla quando salvar
- Botão mostra "📝 Manual"
- Botão "Save Page" visível
```

### **Triggers de Auto-Save:**
- Adicionar/remover elementos
- Mover elementos no canvas
- Editar propriedades
- Trocar de página (salva página atual)

## 📱 Sistema Responsivo

### **Funcionalidades:**
- ✅ **Adaptação Automática**: Elementos se redimensionam conforme tela
- ✅ **Breakpoints**: Desktop (>768px) e Mobile (≤768px)
- ✅ **CSS Responsivo**: Geração automática de media queries
- ✅ **Preview Mobile**: Modo preview adapta ao tamanho atual

### **Composable useResponsive:**
```javascript
// Detecta automaticamente o tamanho da tela
const { isMobile, screenWidth } = useResponsive()

// Aplica scaling automático aos elementos
const scaledWidth = computed(() => 
  isMobile.value ? element.width * 0.8 : element.width
)
```

### **Pré-requisitos:**
- Docker Desktop instalado
- Porta 8080 (frontend) e 3002 (backend) disponíveis

### **Execução Rápida:**
```bash
# 1. Navegar para o diretório do projeto
cd d:\APPS-Python\no-code-rhyno\nexus-mvp

# 2. Subir os containers
docker-compose -f docker-compose.dev.yml up -d

# 3. Verificar status
docker ps

# 4. Acessar a aplicação
# Frontend: http://localhost:8080
# API: http://localhost:3002
```

### **Parar a Aplicação:**
```bash
docker-compose -f docker-compose.dev.yml down
```

---

## 🔍 Detalhes dos Componentes

### **📄 backend/api-gateway/server.js**
**Propósito:** Servidor Express que atua como API Gateway
```javascript
// Principais responsabilidades:
- Gerenciar endpoint /publish para receber dados do editor
- Integrar com o Translation Engine
- Servir arquivos estáticos gerados
- Configurar CORS para comunicação com frontend
```

### **📄 backend/api-gateway/translator.js**
**Propósito:** Engine de conversão de dados JSON para HTML/CSS
```javascript
// Funcionalidades:
- generateHTML(): Converte elementos JSON em HTML
- generateCSS(): Cria estilos CSS correspondentes
- Aplica posicionamento absoluto para elementos
- Suporte a múltiplos tipos de componentes
```

### **📄 editor-frontend/src/App.vue**
**Propósito:** Componente raiz que orquestra toda a aplicação
```vue
// Responsabilidades:
- Layout principal da aplicação
- Função publishPage() para envio ao backend
- Integração entre Toolbox, Canvas e Inspector
- Gerenciamento de estado global
```

### **📄 editor-frontend/src/components/Canvas.vue**
**Propósito:** Área principal de edição visual
```vue
// Funcionalidades:
- Renderização de elementos do editor
- Detecção de cliques para seleção
- Área de drop para novos elementos
- Interface visual WYSIWYG
```

### **📄 editor-frontend/src/components/CanvasElement.vue**
**Propósito:** Componente individual que representa um elemento no canvas
```vue
// Características:
- Implementação custom de drag & drop
- Eventos mouse (mousedown, mousemove, mouseup)
- Posicionamento absoluto
- Visual feedback de seleção
```

### **📄 editor-frontend/src/components/Toolbox.vue**
**Propósito:** Paleta de componentes disponíveis
```vue
// Elementos suportados:
- Texto: Paragrafos e títulos
- Input: Campos de entrada
- Botão: Elementos clicáveis
- Grupo: Containers para outros elementos
```

### **📄 editor-frontend/src/components/Inspector.vue**
**Propósito:** Painel de propriedades para edição de elementos
```vue
// Propriedades editáveis:
- Texto (content)
- Cores (textColor, backgroundColor)
- Dimensões (width, height)
- Posição (x, y)
```

### **📄 editor-frontend/src/store/editor.js**
**Propósito:** Gerenciamento de estado global com Pinia
```javascript
// Estado gerenciado:
- elements: Array de elementos no canvas
- selectedElement: Elemento atualmente selecionado
- nextId: Contador para IDs únicos
```

---

## 📡 API Endpoints

### **🏗️ Projetos**

**GET /api/projects**
- Lista todos os projetos

**POST /api/projects**
```json
{
  "name": "Meu Website"
}
```
- Cria novo projeto com página "home" automática

**DELETE /api/projects/:id**
- Remove projeto e todas suas páginas/elementos

### **📄 Páginas**

**GET /api/projects/:projectId/pages**
- Lista páginas de um projeto

**POST /api/projects/:projectId/pages**
```json
{
  "name": "about",
  "path": "/about"
}
```
- Cria nova página no projeto

**PUT /api/projects/:projectId/pages/:pageId**
```json
{
  "elements": [
    {
      "id": "element_1",
      "type": "text",
      "content": "Hello World",
      "x": 100,
      "y": 100,
      "width": 200,
      "height": 50,
      "textColor": "#000000",
      "backgroundColor": "#ffffff"
    }
  ]
}
```
- Salva elementos da página

**DELETE /api/projects/:projectId/pages/:pageId**
- Remove página e seus elementos

### **📤 Publicação (Legado)**

**POST /publish**
- Gera HTML/CSS para preview (mantido para compatibilidade)

## 🔄 Fluxo de Dados

### **1. Inicialização da Aplicação:**
```
App.vue → loadProjects() → ProjectsDashboard → Lista de Projetos
```

### **2. Criação de Projeto:**
```
ProjectsDashboard → createProject() → API → Projeto + Página Home → Redirect para Editor
```

### **3. Gestão de Páginas:**
```
PagesPanel → createPage() → API → Recarrega Lista → Navegação Automática
```

### **4. Auto-Save:**
```
Canvas → addElement() → autoSaveEnabled? → autoSaveCurrentPage() → API → Feedback Visual
```

### **5. Navegação:**
```
PagesPanel → selectPage() → loadPage() → Canvas → Renderização dos Elementos
```

---

## 🛠️ Desenvolvimento

### **Arquivos Principais:**
- `store/editor.js` - Estado global com auto-save e multi-página
- `components/Canvas.vue` - Editor drag-drop com modo preview
- `components/PagesPanel.vue` - Gestão visual de páginas
- `server.js` - API RESTful com PostgreSQL
- `useResponsive.js` - Sistema de responsividade

### **Comandos Úteis:**
```bash
# Iniciar desenvolvimento
docker-compose -f docker-compose.dev.yml up

# Logs em tempo real
docker-compose -f docker-compose.dev.yml logs -f

# Rebuild containers
docker-compose -f docker-compose.dev.yml up --build

# Parar containers
docker-compose -f docker-compose.dev.yml down

# Limpar sistema Docker
docker system prune -f
```

### **Estrutura de Development:**
- **Hot Reload:** Alterações refletem automaticamente
- **Volume Mapping:** Código sincronizado com containers
- **Ports:** Frontend (5173), Backend (3000), PostgreSQL (5432)
- **Environment:** Desenvolvimento isolado em containers

### **Debugging:**
- **Frontend:** Vue DevTools + Browser DevTools
- **Backend:** Container logs + console.log
- **Database:** Conexão direta via psql ou pgAdmin
- **Network:** Verificar comunicação entre containers

---

## 🎯 Status do Projeto

### ✅ **Funcionalidades Completas:**
- [x] Sistema multi-página completo
- [x] Auto-save com controle manual
- [x] Interface drag-drop responsiva
- [x] Gestão visual de projetos e páginas
- [x] Banco de dados PostgreSQL
- [x] API RESTful completa
- [x] Sistema de preview
- [x] Navegação segura com confirmações
- [x] Containerização Docker

### 🔄 **Próximos Passos:**
- [ ] Sistema de autenticação/usuários
- [ ] Templates pré-definidos
- [ ] Export para deploy externo
- [ ] Mais tipos de elementos
- [ ] Sistema de temas/styling avançado

---

## 📝 Conclusão

O **Nexus MVP** evoluiu de um simples editor de página única para uma **plataforma completa de criação de websites multi-página** com:

- **🏠 Gestão intuitiva de projetos e páginas**
- **💾 Sistema inteligente de auto-save**
- **📱 Interface responsiva e moderna**
- **🔧 Arquitetura escalável e robusta**
- **⚡ Performance otimizada com Docker**

A plataforma oferece uma experiência profissional para criação visual de websites, permitindo que usuários sem conhecimento técnico criem projetos completos de forma intuitiva e eficiente.

## 🗺️ Roadmap

### **Próximas Features:**
- [ ] Mais tipos de componentes (Image, Video, Form)
- [ ] Sistema de templates pré-definidos
- [ ] Undo/Redo para ações do editor
- [ ] Responsive design preview
- [ ] Integração com banco de dados
- [ ] Sistema de usuários e projetos
- [ ] Export para código (HTML/CSS/JS)
- [ ] Marketplace de componentes

### **Melhorias Técnicas:**
- [ ] Testes unitários e e2e
- [ ] CI/CD pipeline
- [ ] Monitoramento e métricas
- [ ] Performance optimization
- [ ] SEO optimization para páginas geradas
- [ ] PWA support

---

## 🤝 Contribuição

Para contribuir com o projeto:

1. **Entenda a Arquitetura:** Leia esta documentação completamente
2. **Setup Local:** Configure o ambiente de desenvolvimento
3. **Padrões de Código:** Mantenha consistência com o código existente
4. **Testes:** Teste suas alterações antes de submeter
5. **Documentação:** Atualize a documentação quando necessário

---

## 📞 Suporte

Para dúvidas ou problemas:
- Verifique os logs dos containers
- Confirme que as portas estão disponíveis
- Valide a configuração do Docker
- Revise esta documentação

---

*Documentação atualizada em: Agosto 2025*
*Versão da Plataforma: MVP 1.0*