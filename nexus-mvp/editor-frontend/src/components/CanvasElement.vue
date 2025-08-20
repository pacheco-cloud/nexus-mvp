<template>
  <div
    ref="elementRef"
    class="canvas-component"
    :class="{ 'is-selected': editorStore.selectedElementId === element.id }"
    :style="elementStyle"
    @click.stop="selectElement"
    @mousedown="startDrag"
  >
    <img 
      v-if="element.type === 'Image'"
      :src="element.properties.src || 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Erro+na+Imagem'"
      :alt="element.properties.alt || 'Imagem'"
      :style="{
        width: '100%',
        height: '100%',
        objectFit: element.properties.objectFit || 'cover',
        borderRadius: (element.properties.borderRadius || 0) + 'px',
        display: 'block'
      }"
      @error="handleImageError"
      draggable="false"
    />
    <strong v-else>{{ element.properties.text || element.type }}</strong>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useEditorStore } from '../store/editor.js';
import { useResponsive } from '../composables/useResponsive.js';

// Recebemos os dados do elemento como uma 'prop' do componente pai (o Canvas)
const props = defineProps({
  element: {
    type: Object,
    required: true,
  },
});

const editorStore = useEditorStore();
const { getResponsiveStyle } = useResponsive();
const elementRef = ref(null);

// Posição reativa do elemento (local para drag)
const position = ref({
  x: props.element.position.x,
  y: props.element.position.y
});

// Watch para atualizar posição quando o elemento muda ou modo muda
watch(
  () => [props.element.position, editorStore.previewMode],
  ([newPosition, newMode]) => {

    position.value = {
      x: newPosition.x,
      y: newPosition.y
    };
    // Força reatividade
    elementRef.value?.style.setProperty('--update-trigger', Date.now());
  },
  { deep: true, immediate: true }
);

// Estado de arraste
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });

function selectElement() {
  editorStore.selectElement(props.element.id);
}

function startDrag(event) {


  
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
  
  // Calcula nova posição relativa ao Canvas - busca especificamente o canvas de edição
  const canvas = document.querySelector('.edit-canvas');
  if (!canvas) {

    return;
  }
  
  const canvasRect = canvas.getBoundingClientRect();
  
  const newX = event.clientX - canvasRect.left - dragStart.value.x;
  const newY = event.clientY - canvasRect.top - dragStart.value.y;
  
  // Atualiza posição local com limites mais permissivos
  position.value = {
    x: Math.max(0, Math.min(newX, canvasRect.width - 100)), // Limita pelo tamanho do canvas
    y: Math.max(0, Math.min(newY, canvasRect.height - 50))
  };
  

}

function stopDrag() {
  if (!isDragging.value) return;
  

  
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

function handleImageError(event) {
  event.target.src = 'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Imagem+Nao+Encontrada';
}

// Estilo computado com responsividade FORÇADA
const elementStyle = computed(() => {

  
  // SEMPRE usa o sistema responsivo como base
  const responsiveStyle = getResponsiveStyle(props.element);
  
  // Se estiver no modo edição E arrastando, usa posição local
  if (!editorStore.isPreviewMode && isDragging.value) {
    responsiveStyle.left = `${position.value.x}px`;
    responsiveStyle.top = `${position.value.y}px`;

  }
  
  // Adiciona estilos de interação
  const finalStyle = {
    ...responsiveStyle,
    backgroundColor: props.element.properties.backgroundColor || 'white',
    cursor: isDragging.value ? 'grabbing' : (editorStore.isPreviewMode ? 'default' : 'grab'),
    userSelect: 'none',
    zIndex: editorStore.selectedElementId === props.element.id ? 10 : (isDragging.value ? 15 : 1),
    transform: isDragging.value ? 'scale(1.02)' : 'scale(1)',
    transition: isDragging.value ? 'none' : 'all 0.3s ease',
    pointerEvents: editorStore.isPreviewMode ? 'auto' : 'all',
    border: editorStore.selectedElementId === props.element.id ? '2px solid #ff4500' : '2px solid #007bff',
  };
  

  return finalStyle;
});

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
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.canvas-component.is-selected {
  border-color: #ff4500;
  box-shadow: 0 0 0 3px rgba(255, 69, 0, 0.4);
}

.canvas-component:hover:not(.is-selected) {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-color: #0056b3;
}

.canvas-component:active {
  cursor: grabbing !important;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}
</style>
