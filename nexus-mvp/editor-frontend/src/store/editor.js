import { defineStore } from 'pinia';

const API_BASE_URL = 'http://localhost:3002'; // A porta da API é 3002

export const useEditorStore = defineStore('editor', {
  state: () => ({
    projects: [],
    currentProjectId: null,
    pages: [], // NOVO: Lista de páginas do projeto atual
    currentPageId: null, // NOVO: ID da página que estamos a editar
    elements: [],
    selectedElementId: null,
    previewMode: 'desktop',
    isPreviewMode: false, // true = preview, false = edição
    
    // Sistema de histórico (NOVO)
    history: [],
    historyIndex: -1,
    maxHistorySize: 50,
    isUndoRedoOperation: false,
    positionUpdateTimeout: null,
    
    // Auto-save
    autoSaveEnabled: true,
    autoSaveInterval: null,
    hasUnsavedChanges: false,
    isSaving: false,
    
    // Dimensões base para responsividade
    baseDimensions: {
      desktop: { width: 1200, height: 800 },
      tablet: { width: 768, height: 1024 },
      mobile: { width: 375, height: 667 }
    }
  }),

  getters: {
    selectedElement: (state) => {
      if (!state.selectedElementId) return null;
      return state.elements.find(element => element.id === state.selectedElementId);
    },
    currentProject: (state) => {
      if (!state.currentProjectId) return null;
      return state.projects.find(p => p.id === state.currentProjectId);
    },
    currentPage: (state) => { // NOVO
      if (!state.currentPageId) return null;
      return state.pages.find(p => p.id === state.currentPageId);
    },
    elementCount: (state) => state.elements.length,
    
    // Getters para Undo/Redo (NOVO)
    canUndo: (state) => state.historyIndex > 0,
    canRedo: (state) => state.historyIndex < state.history.length - 1,
  },

  actions: {
    // --- SISTEMA DE HISTÓRICO (NOVO) ---
    saveToHistory() {
      if (!this.currentPageId || this.isUndoRedoOperation) return;
      
      // Remove histórico futuro se houver
      this.history = this.history.slice(0, this.historyIndex + 1);
      
      // Salva estado atual
      const snapshot = {
        elements: JSON.parse(JSON.stringify(this.elements)),
        timestamp: Date.now()
      };
      
      this.history.push(snapshot);
      
      // Limita tamanho do histórico
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
      } else {
        this.historyIndex++;
      }
    },

    undo() {
      if (this.historyIndex > 0) {
        this.isUndoRedoOperation = true;
        this.historyIndex--;
        this.elements = JSON.parse(JSON.stringify(this.history[this.historyIndex].elements));
        this.selectedElementId = null;
        this.hasUnsavedChanges = true;
        
        if (this.autoSaveEnabled) {
          this.triggerAutoSave();
        }
        this.isUndoRedoOperation = false;
      }
    },

    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.isUndoRedoOperation = true;
        this.historyIndex++;
        this.elements = JSON.parse(JSON.stringify(this.history[this.historyIndex].elements));
        this.selectedElementId = null;
        this.hasUnsavedChanges = true;
        
        if (this.autoSaveEnabled) {
          this.triggerAutoSave();
        }
        this.isUndoRedoOperation = false;
      }
    },
    
    // --- ACTIONS DE PROJETOS (com modificações) ---
    async fetchProjects() {
      const response = await fetch(`${API_BASE_URL}/projects`);
      this.projects = await response.json();
    },

    async loadProject(projectId) {
      // Agora, ao carregar um projeto, também buscamos as suas páginas
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/pages`);
      this.pages = await response.json();
      this.currentProjectId = projectId;
      
      // Se houver páginas, carrega a página "home" por padrão, ou a primeira disponível
      if (this.pages.length > 0) {
        // Procura pela página "home" primeiro
        const homePage = this.pages.find(page => page.name.toLowerCase() === 'home');
        const defaultPage = homePage || this.pages[0];
        await this.loadPage(defaultPage.id);
      } else {
        // Se não houver páginas, limpa o canvas
        this.elements = [];
        this.currentPageId = null;
      }
    },

    async createNewProject(projectName) {
      try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: projectName }),
        });
        
        if (response.ok) {
          const newProject = await response.json();

          await this.fetchProjects(); // Recarrega a lista
          await this.loadProject(newProject.id); // Carrega o novo projeto
        } else {

          alert('Erro ao criar projeto. Verifique o console para detalhes.');
        }
      } catch (error) {

        alert('Erro de conexão. Verifique se o backend está rodando.');
      }
    },
    
    // --- NOVAS ACTIONS PARA PÁGINAS ---
    async loadPage(pageId) {
        // Limpa histórico ao trocar de página (NOVO)
        this.history = [];
        this.historyIndex = -1;
        
        // Salva a página atual antes de trocar (auto-save) - somente se habilitado
        if (this.currentPageId && this.hasUnsavedChanges && this.autoSaveEnabled) {
            await this.autoSaveCurrentPage();
        }
        

        const response = await fetch(`${API_BASE_URL}/pages/${pageId}/elements`);
        const elementsData = await response.json();
        this.elements = elementsData.map(el => ({
            ...el,
            position: typeof el.position === 'string' ? JSON.parse(el.position) : el.position,
            properties: typeof el.properties === 'string' ? JSON.parse(el.properties) : el.properties,
        }));
        
        // Salva estado inicial no histórico (NOVO)
        this.saveToHistory();
        
        this.currentPageId = pageId;
        this.selectedElementId = null;
        this.hasUnsavedChanges = false;
        
        // Inicia auto-save para a nova página - somente se habilitado
        if (this.autoSaveEnabled) {
            this.startAutoSave();
        }
    },

    async createNewPage(pageName) {
        if (!this.currentProjectId) return;

        const response = await fetch(`${API_BASE_URL}/projects/${this.currentProjectId}/pages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: pageName }),
        });
        
        if (response.ok) {
          // Recarrega as páginas do projeto
          const pagesResponse = await fetch(`${API_BASE_URL}/projects/${this.currentProjectId}/pages`);
          this.pages = await pagesResponse.json();
          
          const newPage = await response.json();
          await this.loadPage(newPage.id); // Carrega a nova página vazia
        }
    },

    // --- Actions de Elementos (modificadas) ---
    addElement(type, position) {
      if (!this.currentPageId) {
          alert("Por favor, crie ou carregue uma página primeiro.");
          return;
      }
      
      // Proteção contra undo/redo (NOVO)
      if (this.isUndoRedoOperation) return;
      
      const elementId = 'el_' + Date.now() + Math.random().toString(36).substr(2, 9);
      const newElement = {
        id: elementId,
        type: type,
        position: { x: position.x, y: position.y },
        properties: this.getDefaultProperties(type),
      };
      
      this.elements.push(newElement);
      this.selectedElementId = elementId;
      this.hasUnsavedChanges = true; // Marca como tendo mudanças
      
      // Salva no histórico (NOVO)
      this.saveToHistory();
      
      // Auto-save após adicionar elemento - somente se habilitado
      if (this.autoSaveEnabled) {
        this.triggerAutoSave();
      }
    },

    selectElement(elementId) {
      this.selectedElementId = elementId;

    },

    updateElementProperty(elementId, property, value) {
      // Proteção contra undo/redo (NOVO)
      if (this.isUndoRedoOperation) return;
      
      const element = this.elements.find(el => el.id === elementId);
      if (element) {
        element.properties[property] = value;
        this.hasUnsavedChanges = true; // Marca como tendo mudanças
        
        // Salva no histórico (NOVO)
        this.saveToHistory();
        
        // Auto-save após atualizar propriedade - somente se habilitado
        if (this.autoSaveEnabled) {
          this.triggerAutoSave();
        }
      }
    },
    
    updateElementPosition(elementId, newPosition) {
      const element = this.elements.find(el => el.id === elementId);
      if (element) {
        element.position = { ...newPosition };
        this.hasUnsavedChanges = true; // Marca como tendo mudanças
        
        // Salva no histórico com debounce (NOVO)
        if (!this.isUndoRedoOperation) {
          if (this.positionUpdateTimeout) {
            clearTimeout(this.positionUpdateTimeout);
          }
          
          this.positionUpdateTimeout = setTimeout(() => {
            this.saveToHistory();
            this.positionUpdateTimeout = null;
          }, 500);
        }
        
        // Auto-save após mover elemento (com delay para drag contínuo) - somente se habilitado
        if (this.autoSaveEnabled) {
          this.triggerAutoSave(1000);
        }
      }
    },

    removeElement(elementId) {
      // Proteção contra undo/redo (NOVO)
      if (this.isUndoRedoOperation) return;
      
      const index = this.elements.findIndex(el => el.id === elementId);
      if (index !== -1) {
        this.elements.splice(index, 1);
        this.selectedElementId = null;
        this.hasUnsavedChanges = true;
        
        // Salva no histórico (NOVO)
        this.saveToHistory();
        
        // Auto-save após remover elemento - somente se habilitado
        if (this.autoSaveEnabled) {
          this.triggerAutoSave();
        }
      }
    },

    getDefaultProperties(type) {
      const defaults = {
        Text: {
          text: 'Texto',
          fontSize: 16,
          color: '#000000',
          backgroundColor: 'white',
        },
        Button: {
          text: 'Botão',
          fontSize: 16,
          backgroundColor: '#007bff',
          color: 'white',
          action: ''
        },
        Input: {
          placeholder: 'Digite aqui...',
          fontSize: 14,
          backgroundColor: 'white',
        },
        Group: {
          backgroundColor: '#f0f0f0',
        },
        Image: {
          src: 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Nova+Imagem',
          alt: 'Imagem',
          width: 300,
          height: 200,
          objectFit: 'cover',
          borderRadius: 8
        }
      };
      return defaults[type] || {};
    },

    setPreviewMode(mode) {

      this.previewMode = mode;
    },

    toggleEditPreview() {
      this.isPreviewMode = !this.isPreviewMode;

    },

    // Funções para responsividade
    getResponsivePosition(element, targetMode) {
      const currentDimensions = this.baseDimensions[this.previewMode];
      const targetDimensions = this.baseDimensions[targetMode];
      
      // Converte posição absoluta para percentual
      const percentX = (element.position.x / currentDimensions.width) * 100;
      const percentY = (element.position.y / currentDimensions.height) * 100;
      
      // Converte de volta para posição absoluta na nova dimensão
      return {
        x: (percentX * targetDimensions.width) / 100,
        y: (percentY * targetDimensions.height) / 100
      };
    },

    getResponsiveFontSize(baseFontSize, targetMode) {
      const scaleFactor = {
        desktop: 1.0,
        tablet: 0.9,
        mobile: 0.8
      };
      return Math.round(baseFontSize * (scaleFactor[targetMode] || 1.0));
    },

    getCurrentDimensions() {
      return this.baseDimensions[this.previewMode];
    },

    // --- FUNÇÕES DE AUTO-SAVE ---
    async autoSaveCurrentPage() {
      if (!this.currentPageId || !this.currentProjectId || this.isSaving || !this.autoSaveEnabled) {
        return;
      }
      
      this.isSaving = true;
      try {

        await fetch(`${API_BASE_URL}/pages/${this.currentPageId}/elements`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              elements: this.elements.map(el => ({ ...el, project_id: this.currentProjectId }))
          }),
        });
        
        this.hasUnsavedChanges = false;

        
        // Mostrar feedback visual discreto
        this.showAutoSaveFeedback();
        
      } catch (error) {

      } finally {
        this.isSaving = false;
      }
    },

    triggerAutoSave(delay = 2000) {
      if (!this.autoSaveEnabled || !this.currentPageId) return;
      
      // Cancela auto-save anterior se existir
      if (this.autoSaveTimeout) {
        clearTimeout(this.autoSaveTimeout);
      }
      
      // Agenda novo auto-save
      this.autoSaveTimeout = setTimeout(() => {
        if (this.hasUnsavedChanges && this.autoSaveEnabled) {
          this.autoSaveCurrentPage();
        }
      }, delay);
    },

    startAutoSave() {
      if (!this.autoSaveEnabled) return;
      
      // Para auto-save anterior
      this.stopAutoSave();
      
      // Auto-save periódico a cada 30 segundos
      this.autoSaveInterval = setInterval(() => {
        if (this.hasUnsavedChanges && this.currentPageId && !this.isSaving && this.autoSaveEnabled) {
          this.autoSaveCurrentPage();
        }
      }, 30000);
    },

    stopAutoSave() {
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = null;
      }
      if (this.autoSaveTimeout) {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = null;
      }
    },

    showAutoSaveFeedback() {
      // Função para mostrar feedback visual discreto - somente se auto-save está habilitado
      if (!this.autoSaveEnabled) return;
      
      const event = new CustomEvent('autoSaveCompleted', {
        detail: { message: 'Página salva automaticamente' }
      });
      window.dispatchEvent(event);
    },

    // Função para desativar/ativar auto-save
    toggleAutoSave() {
      this.autoSaveEnabled = !this.autoSaveEnabled;

      
      if (this.autoSaveEnabled) {
        this.startAutoSave();
      } else {
        this.stopAutoSave();
      }
    },

    // Função manual para salvar (quando auto-save está desabilitado)
    async saveCurrentPageManually() {
      if (!this.currentPageId || !this.currentProjectId || this.isSaving) {
        return;
      }
      
      this.isSaving = true;
      try {

        await fetch(`${API_BASE_URL}/pages/${this.currentPageId}/elements`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              elements: this.elements.map(el => ({ ...el, project_id: this.currentProjectId }))
          }),
        });
        
        this.hasUnsavedChanges = false;

        alert('Página salva com sucesso!');
        
      } catch (error) {

        alert('Erro ao salvar página!');
      } finally {
        this.isSaving = false;
      }
    }
  },
});
