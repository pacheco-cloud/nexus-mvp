# 🚀 Nexus MVP - Plataforma No-Code

> **Uma plataforma no-code moderna e escalável similar ao Bubble, desenvolvida com Vue.js 3 e Node.js**

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Objetivo da Plataforma](#-objetivo-da-plataforma)
- [Arquitetura](#-arquitetura)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [Configuração e Execução](#-configuração-e-execução)
- [Detalhes dos Componentes](#-detalhes-dos-componentes)
- [API Endpoints](#-api-endpoints)
- [Fluxo de Dados](#-fluxo-de-dados)
- [Desenvolvimento](#-desenvolvimento)
- [Roadmap](#-roadmap)

---

## 🎯 Visão Geral

O **Nexus MVP** é uma plataforma no-code que permite aos usuários criar páginas web funcionais através de uma interface visual intuitiva de arrastar e soltar (drag-and-drop), sem necessidade de conhecimento em programação.

### Características Principais:
- **Editor Visual**: Interface WYSIWYG para criação de páginas
- **Drag & Drop**: Componentes arrastáveis e posicionáveis
- **Publicação Instantânea**: Geração automática de HTML/CSS
- **Arquitetura Microsserviços**: Backend modular e escalável
- **Containerização**: Deploy simplificado com Docker

---

## 🎪 Objetivo da Plataforma

### **Problema Resolvido:**
Democratizar a criação de páginas web, permitindo que usuários sem conhecimento técnico possam criar interfaces funcionais de forma visual e intuitiva.

### **Público-Alvo:**
- Designers sem conhecimento de código
- Pequenas empresas que precisam de páginas rápidas
- Prototipagem rápida de interfaces
- Educação em desenvolvimento web

### **Valor Proposto:**
1. **Rapidez**: Criação de páginas em minutos vs horas de codificação
2. **Acessibilidade**: Não requer conhecimento técnico
3. **Flexibilidade**: Posicionamento livre de elementos
4. **Produtividade**: Foco no design, não na implementação

---

## 🏗️ Arquitetura

```
┌─────────────┐    HTTP/JSON    ┌─────────────┐    Function Calls    ┌─────────────┐
│             │  ────────────>  │             │  ──────────────────>  │             │
│   Frontend  │                 │ API Gateway │                       │ Translator  │
│   Vue.js 3  │  <────────────  │  Express.js │  <────────────────── │   Engine    │
│             │    Response     │             │    Generated Files    │             │
└─────────────┘                 └─────────────┘                       └─────────────┘
      │                                │                                       │
      │                                │                                       │
      v                                v                                       v
┌─────────────┐                 ┌─────────────┐                       ┌─────────────┐
│   Browser   │                 │   Docker    │                       │  Published  │
│  localhost  │                 │ Containers  │                       │ HTML/CSS    │
│    :8080    │                 │             │                       │    Files    │
└─────────────┘                 └─────────────┘                       └─────────────┘
```

### **Padrão Arquitetural:** 
- **Frontend**: SPA (Single Page Application) com Vue.js 3
- **Backend**: API Gateway pattern com Express.js
- **Comunicação**: RESTful API com JSON
- **Deploy**: Containerização com Docker Compose

---

## 📁 Estrutura do Projeto

```
nexus-mvp/
├── 📁 backend/
│   └── 📁 api-gateway/
│       ├── 📄 server.js           # Servidor Express principal
│       ├── 📄 translator.js       # Engine de tradução JSON → HTML/CSS
│       ├── 📄 package.json        # Dependências do backend
│       └── 📄 Dockerfile          # Container do backend
│
├── 📁 editor-frontend/
│   ├── 📁 src/
│   │   ├── 📄 App.vue             # Componente raiz da aplicação
│   │   ├── 📄 main.js             # Ponto de entrada Vue.js
│   │   ├── 📁 components/
│   │   │   ├── 📄 Toolbox.vue     # Paleta de componentes
│   │   │   ├── 📄 Canvas.vue      # Área de design/edição
│   │   │   ├── 📄 Inspector.vue   # Painel de propriedades
│   │   │   └── 📄 CanvasElement.vue # Elemento individual no canvas
│   │   └── 📁 store/
│   │       └── 📄 editor.js       # Estado global (Pinia)
│   ├── 📄 index.html              # Template HTML base
│   ├── 📄 package.json            # Dependências do frontend
│   ├── 📄 vite.config.js          # Configuração do Vite
│   ├── 📄 Dockerfile              # Container de produção
│   └── 📄 Dockerfile.dev          # Container de desenvolvimento
│
├── 📄 docker-compose.dev.yml      # Orquestração dos containers
├── 📄 .gitignore                  # Arquivos ignorados pelo Git
└── 📄 README.md                   # Esta documentação
```

---

## 💻 Tecnologias Utilizadas

### **Frontend:**
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Vue.js 3** | ^3.4.21 | Framework reativo principal |
| **Pinia** | ^2.1.7 | Gerenciamento de estado |
| **Vite** | ^5.2.0 | Build tool e dev server |
| **@vueuse/core** | ^10.9.0 | Utilitários composables |

### **Backend:**
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | 18-alpine | Runtime JavaScript |
| **Express.js** | ^4.19.2 | Framework web |
| **CORS** | ^2.8.5 | Cross-Origin Resource Sharing |

### **DevOps:**
| Tecnologia | Propósito |
|------------|-----------|
| **Docker** | Containerização |
| **Docker Compose** | Orquestração de containers |

---

## ✨ Funcionalidades Implementadas

### **🎨 Editor Visual:**
- [x] Interface drag-and-drop intuitiva
- [x] Toolbox com componentes disponíveis (Texto, Input, Botão, Grupo)
- [x] Canvas para posicionamento livre de elementos
- [x] Sistema de seleção e edição de elementos
- [x] Painel de propriedades em tempo real

### **🔧 Sistema de Propriedades:**
- [x] Edição de texto em tempo real
- [x] Personalização de cores (cor do texto, fundo)
- [x] Ajuste de dimensões (largura, altura)
- [x] Posicionamento preciso (X, Y)

### **📤 Publicação:**
- [x] Geração automática de HTML/CSS
- [x] Translation Engine (JSON → Web)
- [x] Servimento de páginas estáticas
- [x] URLs únicos para cada página

### **🏗️ Arquitetura:**
- [x] Comunicação Frontend ↔ Backend via API
- [x] Estado reativo com Pinia
- [x] Hot-reload em desenvolvimento
- [x] Containerização completa

---

## 🚀 Configuração e Execução

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

### **POST /publish**
**Descrição:** Recebe dados do editor e gera página HTML/CSS

**Request Body:**
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

**Response:**
```json
{
  "success": true,
  "message": "Página publicada com sucesso!",
  "url": "/published/page-1234567890",
  "timestamp": "2025-08-20T17:30:00.000Z"
}
```

### **GET /published/:pageId**
**Descrição:** Serve a página HTML gerada

**Response:** HTML completo com CSS inline

---

## 🔄 Fluxo de Dados

### **1. Criação de Elemento:**
```
Toolbox → addElement() → Store (Pinia) → Canvas → Renderização
```

### **2. Edição de Propriedades:**
```
Inspector → updateElement() → Store (Pinia) → Canvas → Re-renderização
```

### **3. Drag & Drop:**
```
CanvasElement → mouseEvents → updatePosition() → Store → Canvas
```

### **4. Publicação:**
```
App.vue → publishPage() → API Gateway → Translator → HTML/CSS → File System
```

---

## 🛠️ Desenvolvimento

### **Estrutura de Development:**
- **Hot Reload:** Alterações refletem automaticamente
- **Docker Volume:** Código sincronizado com container
- **Ports:** Frontend (8080), Backend (3002)

### **Comandos Úteis:**
```bash
# Logs em tempo real
docker-compose -f docker-compose.dev.yml logs -f

# Rebuild específico
docker-compose -f docker-compose.dev.yml build nexus-editor-dev

# Verificar containers
docker ps

# Limpar sistema Docker
docker system prune -f
```

### **Debugging:**
- **Frontend:** DevTools do navegador + Vue DevTools
- **Backend:** Logs do container via `docker logs`
- **Network:** Verificar comunicação entre containers

---

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