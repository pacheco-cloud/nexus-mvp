# 🌳 Estrutura de Árvore Completa - Nexus MVP

## 📁 Visão Geral da Arquitetura

```
nexus-mvp/
├── 📂 backend/                              # 🔧 BACKEND SERVICES
│   └── 📂 api-gateway/                      # Gateway principal da API
│       ├── 📄 server.js                     # 🚀 Servidor Express principal
│       ├── 📄 translator.js                 # 🔄 Engine de tradução JSON→HTML/CSS
│       ├── 📄 package.json                  # 📦 Dependências do backend
│       ├── 📄 Dockerfile                    # 🐳 Container de produção
│       └── 📁 published/                    # 📤 Páginas geradas (runtime)
│           ├── page-1692547890123.html      # 🌐 Exemplo de página publicada
│           └── page-1692547890456.html      # 🌐 Outra página publicada
│
├── 📂 editor-frontend/                      # 🎨 FRONTEND APPLICATION
│   ├── 📂 src/                              # Código fonte Vue.js
│   │   ├── 📄 main.js                       # 🚪 Ponto de entrada da aplicação
│   │   ├── 📄 App.vue                       # 🏠 Componente raiz
│   │   │                                    #     ├─ Layout principal
│   │   │                                    #     ├─ Função publishPage()
│   │   │                                    #     └─ Integração Toolbox/Canvas/Inspector
│   │   │
│   │   ├── 📂 components/                   # 🧩 Componentes Vue
│   │   │   ├── 📄 Toolbox.vue               # 🧰 Paleta de componentes
│   │   │   │                                #     ├─ Botões: Texto, Input, Button, Group
│   │   │   │                                #     └─ Função: addElement()
│   │   │   │
│   │   │   ├── 📄 Canvas.vue                # 🎯 Área de design principal
│   │   │   │                                #     ├─ Renderiza elementos do store
│   │   │   │                                #     ├─ Detecção de cliques
│   │   │   │                                #     └─ Interface WYSIWYG
│   │   │   │
│   │   │   ├── 📄 Inspector.vue             # 🔍 Painel de propriedades
│   │   │   │                                #     ├─ Edição de texto (content)
│   │   │   │                                #     ├─ Cores (textColor, backgroundColor)
│   │   │   │                                #     ├─ Dimensões (width, height)
│   │   │   │                                #     └─ Posição (x, y)
│   │   │   │
│   │   │   └── 📄 CanvasElement.vue         # 🎭 Elemento individual
│   │   │                                    #     ├─ Drag & Drop customizado
│   │   │                                    #     ├─ Posicionamento absoluto
│   │   │                                    #     ├─ Visual feedback de seleção
│   │   │                                    #     └─ Eventos mouse (down/move/up)
│   │   │
│   │   └── 📂 store/                        # 🗄️ Gerenciamento de estado
│   │       └── 📄 editor.js                 # 📊 Store Pinia principal
│   │                                        #     ├─ State: elements[], selectedElement
│   │                                        #     ├─ Actions: addElement(), updateElement()
│   │                                        #     └─ Getters: elementos computados
│   │
│   ├── 📂 public/                           # 🌐 Recursos estáticos
│   │   └── 📄 favicon.ico                   # 🖼️ Ícone da aplicação
│   │
│   ├── 📄 index.html                        # 📋 Template HTML base
│   │                                        #     ├─ Meta tags
│   │                                        #     ├─ Título da aplicação
│   │                                        #     └─ Div root para Vue
│   │
│   ├── 📄 package.json                      # 📦 Dependências frontend
│   │                                        #     ├─ Vue.js 3 (^3.4.21)
│   │                                        #     ├─ Pinia (^2.1.7)
│   │                                        #     ├─ Vite (^5.2.0)
│   │                                        #     └─ @vueuse/core (^10.9.0)
│   │
│   ├── 📄 vite.config.js                    # ⚡ Configuração do Vite
│   │                                        #     ├─ Plugin Vue
│   │                                        #     ├─ Dev server config
│   │                                        #     └─ Build options
│   │
│   ├── 📄 Dockerfile                        # 🐳 Container produção
│   │                                        #     ├─ Build estático
│   │                                        #     └─ Nginx serve
│   │
│   └── 📄 Dockerfile.dev                    # 🔧 Container desenvolvimento
│                                            #     ├─ Hot reload habilitado
│                                            #     ├─ Volume sync
│                                            #     └─ Dev server Vite
│
├── 📄 docker-compose.dev.yml                # 🐳 Orquestração containers
│                                            #     ├─ nexus-editor-dev (port 8080)
│                                            #     ├─ nexus-api-gateway (port 3002)
│                                            #     └─ Networks e volumes
│
├── 📄 .gitignore                            # 🚫 Arquivos ignorados Git
│                                            #     ├─ node_modules/
│                                            #     ├─ .env files
│                                            #     └─ build artifacts
│
├── 📄 README.md                             # 📖 Documentação principal
│                                            #     ├─ Visão geral
│                                            #     ├─ Instalação e uso
│                                            #     └─ Arquitetura
│
└── 📄 TECHNICAL_DOCS.md                     # 🔬 Documentação técnica
                                             #     ├─ Análise de código
                                             #     ├─ Fluxos de dados
                                             #     └─ Debugging guides
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
