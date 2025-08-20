<template>
  <div class="toolbox-panel">
    <h3>Elementos</h3>
    <ul>
      <li 
        v-for="component in availableComponents" 
        :key="component.type"
        :draggable="true"
        @dragstart="handleDragStart($event, component)"
        @dragend="handleDragEnd"
        class="draggable-item"
      >
        {{ component.name }}
      </li>
    </ul>

    <hr>
    <div style="background: #e3f2fd; border: 2px solid #2196f3; padding: 15px; margin: 10px 0; border-radius: 8px;">
      <h4 style="color: #1976d2; margin: 0 0 10px 0;">📄 GERENCIAR PÁGINAS</h4>
      <p style="margin: 0 0 10px 0; color: #333;">Aqui você pode criar e gerenciar páginas:</p>
      <PagesPanel />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import PagesPanel from './PagesPanel.vue'; // 1. IMPORTAR O NOVO COMPONENTE

// Lista dos nossos elementos do MVP
const availableComponents = ref([
  { type: 'Text', name: 'Texto' },
  { type: 'Button', name: 'Botão' },
  { type: 'Input', name: 'Input' },
  { type: 'Group', name: 'Grupo' },
]);

// Função para lidar com o início do drag
function handleDragStart(event, component) {
  console.log('Iniciando drag:', component);
  
  // Configurar dados para transferência
  event.dataTransfer.setData('application/json', JSON.stringify({
    type: component.type,
    name: component.name
  }));
  
  // Configurar efeito permitido
  event.dataTransfer.effectAllowed = 'copy';
  
  // Feedback visual
  event.target.style.opacity = '0.5';
}

// Função para resetar o visual após o drag
function handleDragEnd(event) {
  event.target.style.opacity = '1';
  console.log('Drag finalizado');
}
</script>

<style scoped>
.toolbox-panel {
  width: 200px;
  background-color: #ffffff;
  padding: 10px;
  border-right: 1px solid #dfe1e5;
}

h3 {
  margin-top: 0;
  color: #333;
  font-size: 16px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.draggable-item {
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f9fa;
  user-select: none;
  cursor: grab;
  transition: all 0.2s ease;
}

.draggable-item:hover {
  background-color: #e3f2fd;
  border-color: #007bff;
  transform: translateY(-1px);
}

.draggable-item:active {
  cursor: grabbing;
}
</style>
