# 🌳 Estrutura Completa - Nexus MVP Multi-Página

## 📁 Visão Geral da Arquitetura

```
nexus-mvp/
├── 📂 backend/                              # 🔧 BACKEND SERVICES
│   └── 📂 api-gateway/                      # Gateway principal da API
│       ├── 📄 server.js                     # 🚀 API RESTful com PostgreSQL
│       │                                    #     ├─ Endpoints de projetos/páginas
│       │                                    #     ├─ CRUD completo
│       │                                    #     └─ Auto-criação página home
│       ├── 📄 db.js                         # �️ Configuração PostgreSQL
│       ├── 📄 init-db.js                    # � Schema e migrações
│       │                                    #     ├─ Tabelas: projects, pages, elements
│       │                                    #     └─ Relacionamentos 1:N
│       ├── � translator.js                 # � Engine JSON→HTML/CSS responsivo
│       ├── 📄 package.json                  # 📦 Dependências backend
│       └── 📄 Dockerfile                    # 🐳 Container backend
│
├── 📂 editor-frontend/                      # 🎨 FRONTEND APPLICATION
│   ├── 📂 src/                              # Código fonte Vue.js 3
│   │   ├── 📄 main.js                       # 🚪 Configuração Vue + Pinia
│   │   ├── 📄 App.vue                       # 🏠 Componente raiz
│   │   │                                    #     ├─ Navegação projetos
│   │   │                                    #     ├─ Auto-save toggle
│   │   │                                    #     ├─ Save manual
│   │   │                                    #     └─ Confirmações de saída
│   │   │
│   │   ├── 📂 components/                   # 🧩 Componentes Vue
│   │   │   ├── 📄 ProjectsDashboard.vue     # 📋 Dashboard inicial
│   │   │   │                                #     ├─ Lista de projetos
│   │   │   │                                #     ├─ Criação de projetos
│   │   │   │                                #     └─ Navegação para editor
│   │   │   │
│   │   │   ├── 📄 PagesPanel.vue            # 📄 Gestão visual de páginas
│   │   │   │                                #     ├─ Lista páginas do projeto
│   │   │   │                                #     ├─ Criação nova página
│   │   │   │                                #     ├─ Navegação entre páginas
│   │   │   │                                #     └─ Indicador página atual
│   │   │   │
│   │   │   ├── 📄 Toolbox.vue               # 🧰 Paleta + controles
│   │   │   │                                #     ├─ Elementos: Text, Button, Image, etc
│   │   │   │                                #     ├─ Integração PagesPanel
│   │   │   │                                #     └─ Função addElement()
│   │   │   │
│   │   │   ├── 📄 Canvas.vue                # � Editor drag-drop + preview
│   │   │   │                                #     ├─ Modo Edit vs Preview
│   │   │   │                                #     ├─ Sistema responsivo
│   │   │   │                                #     ├─ Renderização elementos
│   │   │   │                                #     └─ Iframe para preview
│   │   │   │
│   │   │   ├── 📄 Inspector.vue             # � Painel propriedades
│   │   │   │                                #     ├─ Edição em tempo real
│   │   │   │                                #     ├─ Propriedades responsivas
│   │   │   │                                #     └─ Preview instantâneo
│   │   │   │
│   │   │   └── 📄 CanvasElement.vue         # � Elemento responsivo
│   │   │                                    #     ├─ Drag & Drop avançado
│   │   │                                    #     ├─ Scaling automático
│   │   │                                    #     ├─ Feedback visual
│   │   │                                    #     └─ Integração useResponsive
│   │   │
│   │   ├── � store/                        # �️ Estado global Pinia
│   │   │   └── 📄 editor.js                 # 📊 Store principal
│   │   │                                    #     ├─ Estado multi-página completo
│   │   │                                    #     ├─ Auto-save inteligente
│   │   │                                    #     ├─ CRUD projetos/páginas
│   │   │                                    #     ├─ Gestão elementos
│   │   │                                    #     └─ Sistema de feedback
│   │   │
│   │   ├── 📂 composables/                  # 🔧 Utilitários Vue
│   │   │   └── 📄 useResponsive.js          # � Sistema responsividade
│   │   │                                    #     ├─ Detecção tamanho tela
│   │   │                                    #     ├─ Breakpoints mobile/desktop
│   │   │                                    #     └─ Scaling automático
│   │   │
│   │   └── 📂 utils/                        # 🛠️ Utilitários
│   │       └── 📄 translator.js             # 🔄 Helpers tradução
│   │
│   ├── 📄 package.json                      # 📦 Dependências Vue.js
│   │                                        #     ├─ Vue.js 3 (^3.4.21)
│   │                                        #     ├─ Pinia (^2.1.7)
│   │                                        #     ├─ Vite (^5.2.0)
│   │                                        #     └─ @vueuse/core (^10.9.0)
│   │
│   ├── 📄 vite.config.js                    # ⚡ Configuração Vite
│   ├── 📄 index.html                        # 📋 Template HTML
│   ├── 📄 Dockerfile                        # 🐳 Container produção
│   └── 📄 Dockerfile.dev                    # 🔧 Container desenvolvimento
│
├── 📄 docker-compose.dev.yml                # � Orquestração 3 serviços
│                                            #     ├─ nexus-editor-dev (5173)
│                                            #     ├─ nexus-api-gateway (3000)
│                                            #     └─ postgres (5432)
│
├── 📄 .gitignore                            # � Arquivos ignorados
├── 📄 README.md                             # 📖 Documentação principal
├── 📄 PROJECT_STRUCTURE.md                  # 🌳 Esta estrutura
├── 📄 TECHNICAL_DOCS.md                     # 🔬 Documentação técnica
└── 📄 ENGINEER_GUIDE.md                     # 👨‍💻 Guia desenvolvedores
```

---

## 🔍 Detalhes por Camada

### **🎨 FRONTEND LAYER (Vue.js 3)**

```
Components Hierarchy:
App.vue (Root)
├── Toolbox.vue (Sidebar Left)
├── Canvas.vue (Center Area)
│   └── CanvasElement.vue (Repeated for each element)
└── Inspector.vue (Sidebar Right)

Data Flow:
Toolbox → Store → Canvas → Visual Update
Inspector → Store → Canvas → Property Update
```

### **🔧 BACKEND LAYER (Express.js)**

```
API Structure:
server.js (Main Server)
├── POST /publish → translator.js → File System
├── GET /published/:id → Static Files
└── CORS Middleware → Frontend Communication

Translation Pipeline:
JSON Elements → translator.js → HTML Generation → File Write
```

### **🐳 DOCKER LAYER (Containerization)**

```
Container Architecture:
docker-compose.dev.yml
├── nexus-editor-dev (Frontend)
│   ├── Port: 8080:5173
│   ├── Volume: ./editor-frontend/src → /app/src
│   └── Hot Reload: Enabled
└── nexus-api-gateway (Backend)
    ├── Port: 3002:3000
    ├── Volume: Published files
    └── Environment: Development
```

---

## 📊 Mapa de Dependências

### **Frontend Dependencies Tree:**
```
nexus-editor
├── vue@3.4.21 (Core Framework)
├── pinia@2.1.7 (State Management)
├── @vueuse/core@10.9.0 (Composition Utilities)
└── devDependencies
    ├── @vitejs/plugin-vue@5.0.4
    └── vite@5.2.0
```

### **Backend Dependencies Tree:**
```
nexus-api-gateway
├── express@4.19.2 (Web Framework)
├── cors@2.8.5 (Cross-Origin Support)
└── devDependencies
    └── nodemon@3.1.0 (Development)
```

---

## 🌐 Fluxo de Rede

```
Browser (localhost:8080)
    ↓ HTTP Requests
Frontend Container (Vue.js)
    ↓ API Calls (localhost:3002)
Backend Container (Express.js)
    ↓ File Operations
File System (/published/)
    ↓ Static Serving
Generated Web Pages
```

---

## 📁 Arquivos por Categoria

### **🔧 Configuration Files:**
```
nexus-mvp/
├── package.json (×2)           # Dependências e scripts
├── vite.config.js              # Build configuration
├── docker-compose.dev.yml      # Container orchestration
├── Dockerfile (×2)             # Container definitions
└── .gitignore                  # Version control
```

### **💻 Source Code Files:**
```
nexus-mvp/
├── server.js                   # Backend main server
├── translator.js               # JSON to HTML converter
├── main.js                     # Frontend entry point
├── App.vue                     # Root component
└── components/*.vue            # Vue components (4 files)
```

### **📚 Documentation Files:**
```
nexus-mvp/
├── README.md                   # Main documentation
├── TECHNICAL_DOCS.md           # Technical details
└── PROJECT_STRUCTURE.md        # This file
```

### **🏗️ Build & Runtime Files:**
```
nexus-mvp/
├── node_modules/ (×2)          # Dependencies (not tracked)
├── dist/ (frontend)            # Build output (not tracked)
└── published/ (backend)        # Generated pages (runtime)
```

---

## 🎯 Pontos de Entrada

### **Development Mode:**
1. **`docker-compose -f docker-compose.dev.yml up`** → Inicia containers
2. **`localhost:8080`** → Acessa editor frontend
3. **`localhost:3002`** → API backend (opcional)

### **Code Entry Points:**
1. **`editor-frontend/src/main.js`** → Vue.js bootstrap
2. **`backend/api-gateway/server.js`** → Express.js server
3. **`docker-compose.dev.yml`** → Container orchestration

---

## 🔄 Data Flow Map

```
User Interaction
    ↓
Vue Components (Frontend)
    ↓
Pinia Store (State Management)
    ↓
API Request (HTTP)
    ↓
Express Server (Backend)
    ↓
Translator Engine (Processing)
    ↓
File System (Storage)
    ↓
Static File Serving (Output)
    ↓
Published Web Page (Result)
```

---

*Esta estrutura representa o estado atual do projeto após a limpeza e otimização realizada.*
