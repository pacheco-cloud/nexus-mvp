<template>
  <div id="nexus-app" v-if="editorStore.currentProjectId">
    <header class="app-header">
      <div class="header-left">
        <button @click="goBackToProjects" class="back-button" title="Voltar aos Projetos">
          🏠 Projetos
        </button>
        <h1>
          Editor: {{ editorStore.currentProject?.name }}
          <span v-if="editorStore.currentPage"> / {{ editorStore.currentPage.name }}</span>
        </h1>
      </div>
      
      <div class="view-controls">
        <button @click="editorStore.setPreviewMode('desktop')" :class="{ active: editorStore.previewMode === 'desktop' }">🖥️</button>
        <button @click="editorStore.setPreviewMode('tablet')" :class="{ active: editorStore.previewMode === 'tablet' }">📱</button>
        <button @click="editorStore.setPreviewMode('mobile')" :class="{ active: editorStore.previewMode === 'mobile' }">📲</button>
        
        <!-- Controles de Histórico (NOVO) -->
        <div class="control-separator"></div>
        <button 
          @click="editorStore.undo()" 
          :disabled="!editorStore.canUndo"
          class="history-button"
          title="Desfazer (Ctrl+Z)">
          ↶
        </button>
        <button 
          @click="editorStore.redo()" 
          :disabled="!editorStore.canRedo"
          class="history-button"
          title="Refazer (Ctrl+Y)">
          ↷
        </button>
        
        <div class="mode-separator"></div>
        <button @click="editorStore.toggleEditPreview()" :class="{ active: editorStore.isPreviewMode }" class="preview-toggle">
          {{ editorStore.isPreviewMode ? '🎨 Editar' : '👁️ Preview' }}
        </button>
        
        <!-- Indicador de Responsividade -->
        <div class="responsive-indicator" v-if="!editorStore.isPreviewMode">
          <span class="responsive-label">📏 Responsivo</span>
          <span class="responsive-status">{{ getResponsiveStatus() }}</span>
        </div>
      </div>

      <div class="save-controls">
        <!-- Indicador de Auto-Save -->
        <div class="auto-save-indicator">
          <span v-if="editorStore.isSaving" class="saving">💾 Salvando...</span>
          <span v-else-if="editorStore.hasUnsavedChanges" class="unsaved">⚠️ Não salvo</span>
          <span v-else class="saved">✅ Salvo</span>
          <button @click="editorStore.toggleAutoSave()" :class="{ active: editorStore.autoSaveEnabled }" class="auto-save-toggle" title="Toggle Auto-save">
            {{ editorStore.autoSaveEnabled ? '🔄 Auto' : '📝 Manual' }}
          </button>
        </div>
        
        <!-- Botão de Save Manual (aparece quando auto-save está desabilitado) -->
        <button 
          v-if="!editorStore.autoSaveEnabled" 
          @click="editorStore.saveCurrentPageManually()" 
          class="manual-save-button"
          :disabled="editorStore.isSaving || !editorStore.hasUnsavedChanges"
        >
          💾 Salvar Página
        </button>
        
        <button @click="publishPage" class="publish-button">🚀 Publicar</button>
      </div>
    </header>
    <main class="editor-main">
      <Toolbox />
      <Canvas />
      <Inspector />
    </main>
  </div>

  <ProjectsDashboard v-else />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import Toolbox from './components/Toolbox.vue'
import Canvas from './components/Canvas.vue'
import Inspector from './components/Inspector.vue'
import ProjectsDashboard from './components/ProjectsDashboard.vue' // Importar o novo componente
import { useEditorStore } from './store/editor.js'

const editorStore = useEditorStore();

// Auto-save feedback
let autoSaveListener;

onMounted(() => {
  // Listener para feedback de auto-save
  autoSaveListener = (event) => {
    showToast(event.detail.message);
  };
  window.addEventListener('autoSaveCompleted', autoSaveListener);
  
  // Atalhos de teclado para Undo/Redo (NOVO)
  document.addEventListener('keydown', handleKeyboardShortcuts);
});

onUnmounted(() => {
  if (autoSaveListener) {
    window.removeEventListener('autoSaveCompleted', autoSaveListener);
  }
  // Cleanup atalhos (NOVO)
  document.removeEventListener('keydown', handleKeyboardShortcuts);
});

// Função para atalhos de teclado (NOVO)
function handleKeyboardShortcuts(event) {
  // Ignora se estiver digitando em um input, textarea ou elemento editável
  const activeElement = document.activeElement;
  const isInputFocused = activeElement && (
    activeElement.tagName === 'INPUT' || 
    activeElement.tagName === 'TEXTAREA' ||
    activeElement.contentEditable === 'true' ||
    activeElement.hasAttribute('contenteditable')
  );
  
  if (isInputFocused) {
    return;
  }
  
  if (event.ctrlKey || event.metaKey) {
    if (event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      editorStore.undo();
    } else if (event.key === 'y' || (event.key === 'z' && event.shiftKey)) {
      event.preventDefault();
      editorStore.redo();
    }
  }
}

function showToast(message) {
  // Criar elemento de toast
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: rgba(40, 167, 69, 0.9);
    color: white;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  // Mostrar toast
  setTimeout(() => toast.style.opacity = '1', 100);
  
  // Remover toast após 2 segundos
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 2000);
}

function goBackToProjects() {
  // Salva a página atual antes de sair (se houver mudanças e auto-save estiver habilitado)
  if (editorStore.hasUnsavedChanges && editorStore.currentPageId) {
    if (editorStore.autoSaveEnabled) {
      editorStore.autoSaveCurrentPage();
    } else {
      // Se auto-save está desabilitado, pergunta se quer salvar
      const shouldSave = confirm('Você tem alterações não salvas. Deseja salvar antes de sair?');
      if (shouldSave) {
        editorStore.saveCurrentPageManually();
      }
    }
  }
  
  // Para auto-save antes de sair
  editorStore.stopAutoSave();
  
  // Limpa o projeto atual para voltar ao dashboard
  editorStore.currentProjectId = null;
  editorStore.currentPageId = null;
  editorStore.pages = [];
  editorStore.elements = [];
  editorStore.selectedElementId = null;
  editorStore.hasUnsavedChanges = false;
}

function getResponsiveStatus() {
  const mode = editorStore.previewMode;
  const dimensions = editorStore.baseDimensions[mode];
  
  return `${mode.toUpperCase()} (${dimensions.width}×${dimensions.height})`;
}

async function publishPage() {

  
  // 1. Pegamos o estado atual dos elementos da nossa store
  const pageState = editorStore.elements;
  
  // 2. Verificamos se há algo para publicar
  if (pageState.length === 0) {
    alert('O Canvas está vazio! Adicione alguns elementos antes de publicar.');
    return;
  }
  
  try {
    // 3. Enviamos os dados para o nosso futuro back-end
    const response = await fetch('http://localhost:3002/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pageState),
    });
    
    if (!response.ok) {
      throw new Error('A resposta do servidor não foi OK');
    }
    
    const result = await response.json();
    
    // 4. Mostramos um alerta de sucesso com a URL da página publicada
    alert(`Página publicada com sucesso! Acesse em: ${result.url}`);
    
  } catch (error) {

    alert('Erro ao publicar. O serviço de back-end está rodando? (Veja o console para detalhes)');
  }
}
</script>

<style>
/* Estilos Globais */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

#nexus-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #ffffff;
  border-bottom: 1px solid #dfe1e5;
  height: 50px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.back-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.back-button:hover {
  background: #5a6268;
}

.app-header h1 {
  font-size: 18px;
  margin: 0;
}

.save-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.2s ease;
}

.save-button:hover {
  background-color: #218838;
}

.publish-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.publish-button:hover {
  background-color: #0056b3;
}

/* Adicione este CSS na tag <style> do App.vue */
.view-controls {
  display: flex;
  gap: 5px;
  background-color: #e9ecef;
  padding: 4px;
  border-radius: 6px;
}

.view-controls button {
  background-color: transparent;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.view-controls button:hover {
  background-color: #dee2e6;
}

.view-controls button.active {
  background-color: #007bff;
  color: white;
}

.mode-separator {
  width: 1px;
  background-color: #ced4da;
  margin: 0 5px;
}

.preview-toggle {
  font-size: 14px !important;
  font-weight: bold;
  min-width: 80px;
}

.preview-toggle.active {
  background-color: #28a745 !important;
  color: white !important;
}

.responsive-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid rgba(40, 167, 69, 0.3);
  padding: 6px 12px;
  border-radius: 6px;
  margin-left: 10px;
}

.responsive-label {
  font-size: 12px;
  color: #28a745;
  font-weight: bold;
}

.responsive-status {
  font-size: 12px;
  color: #fff;
  background: #28a745;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.editor-main {
  display: flex;
  flex-grow: 1;
  /* Ocupa o resto da altura */
}

/* Auto-Save Indicator Styles */
.save-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auto-save-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.auto-save-indicator .saving {
  color: #ffc107;
  font-size: 12px;
  font-weight: bold;
  animation: pulse 1.5s infinite;
}

.auto-save-indicator .unsaved {
  color: #dc3545;
  font-size: 12px;
  font-weight: bold;
}

.auto-save-indicator .saved {
  color: #28a745;
  font-size: 12px;
  font-weight: bold;
}

.auto-save-toggle {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s ease;
  font-weight: bold;
}

.auto-save-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.auto-save-toggle.active {
  background: #28a745;
  border-color: #28a745;
}

.manual-save-button {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.manual-save-button:hover:not(:disabled) {
  background: #218838;
}

.manual-save-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Estilos para controles de histórico (NOVO) */
.control-separator {
  width: 1px;
  height: 20px;
  background: #dee2e6;
  margin: 0 8px;
}

.history-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.2s;
  min-width: 32px;
}

.history-button:hover:not(:disabled) {
  background: #5a6268;
  transform: translateY(-1px);
}

.history-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #adb5bd;
  transform: none;
}

.history-button:active:not(:disabled) {
  transform: translateY(0);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Melhorias de Responsividade (EXTRAÍDO) */
@media (max-width: 768px) {
  .app-header {
    flex-wrap: wrap;
    padding: 10px 15px;
    height: auto;
    min-height: 50px;
  }
  
  .header-left {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .view-controls {
    flex-wrap: wrap;
    gap: 3px;
  }
  
  .view-controls button {
    padding: 4px 8px;
    font-size: 16px;
  }
  
  .responsive-indicator {
    margin-left: 0;
    margin-top: 5px;
  }
  
  .save-controls {
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 5px;
  }
  
  .auto-save-indicator {
    font-size: 11px;
    padding: 6px 10px;
  }
  
  .history-button {
    padding: 5px 8px;
    min-width: 28px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .app-header h1 {
    font-size: 16px;
  }
  
  .back-button {
    padding: 6px 10px;
    font-size: 13px;
  }
  
  .view-controls button {
    padding: 3px 6px;
    font-size: 14px;
  }
  
  .preview-toggle {
    min-width: 70px !important;
    font-size: 12px !important;
  }
}
</style>
