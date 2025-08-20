<template>
  <div 
    class="canvas-panel" 
    ref="dropZoneRef"
    @dragover="handleDragOver"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    :class="{ 'drag-over': isDragOver }"
    @click="editorStore.selectElement(null)" 
  >
    <CanvasElement
      v-for="element in editorStore.elements"
      :key="element.id"
      :element="element"
    />
    
    <div v-if="!editorStore.elements.length" class="empty-canvas">
      <p>📋 Área de Construção (Canvas)</p>
      <p>Arraste elementos da Toolbox para aqui</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useEditorStore } from '../store/editor.js';
import CanvasElement from './CanvasElement.vue'; // 1. Importar o novo componente

const dropZoneRef = ref(null);
const editorStore = useEditorStore();
const isDragOver = ref(false);

// O código para 'drop' da toolbox permanece exatamente o mesmo
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
  
  console.log('Drop detectado!');
  
  try {
    const droppedData = JSON.parse(event.dataTransfer.getData('application/json'));
    console.log('Dados recebidos:', droppedData);
    
    // Pegamos a posição do mouse relativa ao Canvas
    const canvasRect = dropZoneRef.value.getBoundingClientRect();
    const position = {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top,
    };
    
    console.log('Posição calculada:', position);

    // MODIFICADO: Chamamos a action da nova store
    editorStore.addElement(droppedData.type, position);
    
    console.log('Elemento adicionado à editorStore');
  } catch (error) {
    console.error('Erro ao processar drop:', error);
  }
}
</script>

<style scoped>
/* O CSS do Canvas fica mais simples agora */
.canvas-panel {
  flex-grow: 1;
  background-color: #f0f2f5;
  padding: 20px;
  position: relative;
  overflow: hidden;
  min-height: 500px;
  transition: background-color 0.2s ease;
}

.canvas-panel.drag-over {
  background-color: #e3f2fd;
  border: 2px dashed #007bff;
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
</style>
