<template>
  <div class="canvas-container">
    <!-- Modo Preview: iframe isolado -->
    <div v-if="editorStore.isPreviewMode" class="preview-wrapper" :style="wrapperStyle">
      <iframe
        ref="previewIframe"
        class="preview-iframe"
        sandbox="allow-scripts"
        :srcdoc="iframeContent"
      ></iframe>
    </div>

    <!-- Modo Edição: Canvas editável -->
    <div v-else class="edit-mode-container">
      <!-- Header informativo do modo edição -->
      <div class="edit-mode-header">
        <span class="mode-indicator">🎨 MODO EDIÇÃO</span>
        <span class="dimensions-badge">{{ dimensionsText }}</span>
      </div>
      
      <div 
        class="edit-canvas" 
        :style="editCanvasStyle"
        ref="dropZoneRef"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
        :class="{ 'drag-over': isDragOver }"
        @click="editorStore.selectElement(null)">
        
        <CanvasElement
          v-for="element in editorStore.elements"
          :key="element.id"
          :element="element"
        />
        
        <div v-if="!editorStore.elements.length" class="empty-canvas">
          <p>📋 Área de Construção (Canvas)</p>
          <p>Arraste elementos da Toolbox para aqui</p>
          <p class="help-text">Clique e arraste elementos existentes para movê-los</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useEditorStore } from '../store/editor.js';
import { useResponsive } from '../composables/useResponsive.js';
import { generateHTML, generateCSS, generateJS } from '../utils/translator.js';
import CanvasElement from './CanvasElement.vue';

const editorStore = useEditorStore();
const { getContainerWidth, getContainerHeight, currentDimensions } = useResponsive();
const previewIframe = ref(null);
const dropZoneRef = ref(null);
const isDragOver = ref(false);

// Listener para teclas (delete elemento)
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});

function handleKeydown(event) {
  // Delete ou Backspace para remover elemento selecionado
  if ((event.key === 'Delete' || event.key === 'Backspace') && editorStore.selectedElementId) {
    event.preventDefault();
    editorStore.removeElement(editorStore.selectedElementId);
  }
}

// Mapeia os modos de preview para dimensões (agora usando store)
const previewDimensions = computed(() => ({
  desktop: { width: '100%', height: '100%' },
  tablet: { width: `${editorStore.baseDimensions.tablet.width}px`, height: `${editorStore.baseDimensions.tablet.height}px` },
  mobile: { width: `${editorStore.baseDimensions.mobile.width}px`, height: `${editorStore.baseDimensions.mobile.height}px` },
}));

// Propriedade computada para o estilo do wrapper do iframe (modo preview)
const wrapperStyle = computed(() => {
  return previewDimensions.value[editorStore.previewMode] || previewDimensions.value.desktop;
});

// Propriedade computada para o estilo do canvas editável (responsivo)
const editCanvasStyle = computed(() => {
  const dimensions = currentDimensions.value;
  
  if (editorStore.previewMode === 'desktop') {
    return { 
      width: '100%', 
      height: '100%',
      minWidth: `${dimensions.width}px`,
      minHeight: `${dimensions.height}px`,
    };
  }
  
  return {
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    margin: '0 auto',
    border: '2px dashed #007bff',
    borderRadius: '8px',
  };
});

// Texto informativo das dimensões (responsivo)
const dimensionsText = computed(() => {
  const mode = editorStore.previewMode;
  const dims = currentDimensions.value;
  
  if (mode === 'desktop') {
    return `Desktop (${dims.width}×${dims.height} base)`;
  }
  
  return `${mode.charAt(0).toUpperCase() + mode.slice(1)} (${dims.width}×${dims.height})`;
});

// Propriedade computada para o conteúdo HTML do iframe (modo preview)
const iframeContent = computed(() => {
  const elements = editorStore.elements;
  
  // Gera apenas os elementos com estilos inline diretos
  const elementsHTML = elements.map(el => {
    const textContent = el.properties.text || el.type;
    const props = el.properties;
    
    // Estilos específicos por tipo de elemento
    const isButton = el.type === 'Button';
    const baseColor = isButton ? '#007bff' : '#6c757d';
    const bgColor = isButton ? props.backgroundColor || '#007bff' : props.backgroundColor || 'white';
    const textColor = isButton ? '#ffffff' : props.fontColor || '#000000';
    const borderColor = isButton ? '#007bff' : '#007bff';
    
    // Estilo inline COMPLETO para garantir que aparece no iframe
    const style = `
      position: absolute; 
      left: ${el.position.x}px; 
      top: ${el.position.y}px;
      font-size: ${props.fontSize || 16}px;
      background-color: ${bgColor};
      color: ${textColor};
      border: 2px solid ${borderColor};
      padding: 12px;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      min-width: 100px;
      text-align: center;
      box-sizing: border-box;
      cursor: ${props.action ? 'pointer' : 'default'};
      user-select: none;
      transition: all 0.3s ease;
      font-weight: ${isButton ? 'bold' : 'normal'};
    `.replace(/\s+/g, ' ').trim();
    
    return `<div id="${el.id}" class="element" style="${style}" onclick="${props.action ? `alert('${props.action}')` : ''}">${textContent}</div>`;
  }).join('\n');

  const css = generateCSS(elements);
  const js = generateJS(elements);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            margin: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8f9fa;
          }
          .element:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            transform: translateY(-1px) !important;
          }
          ${css}
        </style>
      </head>
      <body>
        ${elementsHTML}
        <script>${js}<\/script>
      </body>
    </html>
  `;
});

// Funções de drag and drop para o modo edição
function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

function handleDragEnter(event) {
  event.preventDefault();
  isDragOver.value = true;
}

function handleDragLeave(event) {
  event.preventDefault();
  isDragOver.value = false;
}

function handleDrop(event) {
  event.preventDefault();
  isDragOver.value = false;
  

  
  try {
    const droppedData = JSON.parse(event.dataTransfer.getData('application/json'));

    
    // Pegamos a posição do mouse relativa ao Canvas
    const canvasRect = dropZoneRef.value.getBoundingClientRect();
    const position = {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top,
    };
    


    // Chamamos a action da store
    editorStore.addElement(droppedData.type, position);
    

  } catch (error) {

  }
}

</script>

<style scoped>
.canvas-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e9ecef;
  overflow: auto;
  padding: 20px;
}

/* Estilos para modo preview */
.preview-wrapper {
  background-color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease-in-out;
  border-radius: 8px;
  overflow: hidden;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Estilos para modo edição */
.edit-mode-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.edit-mode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border-radius: 8px 8px 0 0;
  margin-bottom: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.mode-indicator {
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dimensions-badge {
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.edit-canvas {
  background-color: #f8f9fa;
  position: relative;
  transition: all 0.3s ease-in-out;
  min-height: 600px;
  flex-grow: 1;
  border-radius: 0 0 8px 8px;
}

.edit-canvas.drag-over {
  background-color: #e3f2fd;
  border-color: #2196f3 !important;
  border-style: dashed !important;
}

.empty-canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #6c757d;
  font-size: 16px;
  pointer-events: none;
}

.empty-canvas p:first-child {
  font-size: 24px;
  margin-bottom: 8px;
}

.help-text {
  font-size: 12px;
  color: #28a745;
  font-weight: bold;
  margin-top: 5px;
}
</style>
