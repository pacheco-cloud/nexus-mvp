<template>
  <div
    ref="elementRef"
    class="canvas-component"
    :class="{ 'is-selected': editorStore.selectedElementId === element.id }"
    :style="elementStyle"
    @click.stop="selectElement"
    @mousedown="startDrag"
  >
    <strong>{{ element.properties.text || element.type }}</strong>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useEditorStore } from '../store/editor.js';

// Recebemos os dados do elemento como uma 'prop' do componente pai (o Canvas)
const props = defineProps({
  element: {
    type: Object,
    required: true,
  },
});

const editorStore = useEditorStore();
const elementRef = ref(null);

// Posição reativa do elemento
const position = ref({
  x: props.element.position.x,
  y: props.element.position.y
});

// Estado de arraste
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });

function selectElement() {
  editorStore.selectElement(props.element.id);
}

function startDrag(event) {
  console.log('🎯 Iniciando drag do elemento:', props.element.id);
  
  isDragging.value = true;
  
  // Calcula o offset do mouse em relação ao elemento
  const rect = elementRef.value.getBoundingClientRect();
  dragStart.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
  
  // Seleciona o elemento
  selectElement();
  
  // Adiciona listeners globais
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  
  // Previne seleção de texto
  event.preventDefault();
}

function handleDrag(event) {
  if (!isDragging.value) return;
  
  // Calcula nova posição relativa ao Canvas
  const canvas = document.querySelector('.canvas-panel');
  const canvasRect = canvas.getBoundingClientRect();
  
  const newX = event.clientX - canvasRect.left - dragStart.value.x;
  const newY = event.clientY - canvasRect.top - dragStart.value.y;
  
  // Atualiza posição local
  position.value = {
    x: Math.max(0, newX), // Impede sair pela esquerda/cima
    y: Math.max(0, newY)
  };
}

function stopDrag() {
  if (!isDragging.value) return;
  
  console.log('🎯 Finalizando drag. Nova posição:', position.value);
  
  isDragging.value = false;
  
  // Remove listeners globais
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  
  // Salva posição na store
  editorStore.updateElementPosition(props.element.id, {
    x: position.value.x,
    y: position.value.y
  });
}

// Estilo computado com posição dinâmica
const elementStyle = computed(() => ({
  position: 'absolute',
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  backgroundColor: props.element.properties.backgroundColor || 'white',
  fontSize: `${props.element.properties.fontSize || 16}px`,
  cursor: isDragging.value ? 'grabbing' : 'grab',
  userSelect: 'none',
  zIndex: editorStore.selectedElementId === props.element.id ? 10 : 1,
}));

// Cleanup ao desmontar componente
onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
});

</script>

<style scoped>
.canvas-component {
  background-color: white;
  border: 2px solid #007bff;
  padding: 12px;
  border-radius: 6px;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  min-width: 100px;
  text-align: center;
  position: absolute;
  transition: box-shadow 0.2s ease;
}

.canvas-component.is-selected {
  border-color: #ff4500;
  box-shadow: 0 0 0 3px rgba(255, 69, 0, 0.4);
}

.canvas-component:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.canvas-component:active {
  cursor: grabbing !important;
}
</style>
