<template>
  <div class="inspector-panel">
    <h3>🔧 PAINEL DE EDIÇÃO</h3>
    
    <div v-if="editorStore.selectedElement" style="border: 3px solid red; padding: 10px;">
      <h4 style="color: red;">✅ ELEMENTO SELECIONADO!</h4>
      
      <div style="background: yellow; padding: 10px; margin: 10px 0;">
        <label><strong>✏️ EDITAR TEXTO:</strong></label>
        <input 
          type="text" 
          :value="editorStore.selectedElement.properties.text || 'vazio'"
          @input="updateText($event.target.value)"
          style="width: 100%; padding: 10px; font-size: 16px; border: 3px solid blue;"
        />
      </div>

      <div style="background: lightgreen; padding: 10px; margin: 10px 0;">
        <label><strong>📏 TAMANHO DA FONTE:</strong></label>
        <input 
          type="number" 
          :value="editorStore.selectedElement.properties.fontSize || 16"
          @input="updateFontSize($event.target.value)"
          style="width: 100%; padding: 10px; font-size: 16px; border: 3px solid green;"
        />
      </div>

      <div style="background: lightcoral; padding: 10px; margin: 10px 0;">
        <label><strong>🎨 COR DE FUNDO:</strong></label>
        <input 
          type="text" 
          :value="editorStore.selectedElement.properties.backgroundColor || 'white'"
          @input="updateBackgroundColor($event.target.value)"
          placeholder="red, blue, #ff0000"
          style="width: 100%; padding: 10px; font-size: 16px; border: 3px solid red;"
        />
      </div>

      <div style="background: #f0e6ff; padding: 10px; margin: 10px 0;" v-if="editorStore.selectedElement.type === 'Button'">
        <label><strong>⚡ AÇÃO AO CLICAR (ALERTA):</strong></label>
        <input 
          type="text" 
          placeholder="Mensagem do alerta..."
          :value="editorStore.selectedElement.properties.action?.message || ''"
          @input="updateActionMessage($event.target.value)"
          style="width: 100%; padding: 10px; font-size: 16px; border: 3px solid purple;"
        />
      </div>

      <!-- PROPRIEDADES DE IMAGEM -->
      <div v-if="editorStore.selectedElement.type === 'Image'" 
           style="background: #e6f3ff; padding: 10px; margin: 10px 0;">
        <label><strong>🔗 URL DA IMAGEM:</strong></label>
        <input 
          type="text" 
          :value="editorStore.selectedElement.properties.src || ''"
          @input="updateProperty('src', $event.target.value)"
          placeholder="https://exemplo.com/imagem.jpg"
          style="width: 100%; padding: 10px; font-size: 16px; border: 3px solid #2196f3; margin: 5px 0;"
        />
        
        <label><strong>📝 TEXTO ALTERNATIVO:</strong></label>
        <input 
          type="text" 
          :value="editorStore.selectedElement.properties.alt || ''"
          @input="updateProperty('alt', $event.target.value)"
          placeholder="Descrição da imagem"
          style="width: 100%; padding: 10px; font-size: 16px; border: 3px solid #2196f3; margin: 5px 0;"
        />
        
        <label><strong>📐 LARGURA (px):</strong></label>
        <input 
          type="number" 
          :value="editorStore.selectedElement.properties.width || 300"
          @input="updateProperty('width', parseInt($event.target.value) || 300)"
          min="50"
          max="1200"
          style="width: 100%; padding: 10px; font-size: 16px; border: 3px solid #2196f3; margin: 5px 0;"
        />
        
        <label><strong>📏 ALTURA (px):</strong></label>
        <input 
          type="number" 
          :value="editorStore.selectedElement.properties.height || 200"
          @input="updateProperty('height', parseInt($event.target.value) || 200)"
          min="50"
          max="800"
          style="width: 100%; padding: 10px; font-size: 16px; border: 3px solid #2196f3; margin: 5px 0;"
        />
        
        <label><strong>🖼️ AJUSTE:</strong></label>
        <select 
          :value="editorStore.selectedElement.properties.objectFit || 'cover'"
          @change="updateProperty('objectFit', $event.target.value)"
          style="width: 100%; padding: 10px; font-size: 16px; border: 3px solid #2196f3; margin: 5px 0;"
        >
          <option value="cover">Cobrir (Cover)</option>
          <option value="contain">Conter (Contain)</option>
          <option value="fill">Preencher (Fill)</option>
          <option value="scale-down">Reduzir (Scale-down)</option>
        </select>
        
        <label><strong>🔄 BORDA ARREDONDADA (px):</strong></label>
        <input 
          type="number" 
          :value="editorStore.selectedElement.properties.borderRadius || 0"
          @input="updateProperty('borderRadius', parseInt($event.target.value) || 0)"
          min="0"
          max="50"
          style="width: 100%; padding: 10px; font-size: 16px; border: 3px solid #2196f3; margin: 5px 0;"
        />
      </div>

      <div style="background: #f0f0f0; padding: 10px; margin: 10px 0;">
        <strong>📋 INFO:</strong><br>
        ID: {{ editorStore.selectedElement.id }}<br>
        Tipo: {{ editorStore.selectedElement.type }}
      </div>

    </div>
    
    <div v-else style="border: 3px solid orange; padding: 20px; text-align: center;">
      <h4 style="color: orange;">⚠️ NENHUM ELEMENTO SELECIONADO</h4>
      <p>Clique em um elemento no Canvas para editá-lo</p>
    </div>

  </div>
</template>

<script setup>
import { useEditorStore } from '../store/editor.js';
const editorStore = useEditorStore();

function updateText(value) {

  if (editorStore.selectedElementId) {
    editorStore.updateElementProperty(editorStore.selectedElementId, 'text', value);
  }
}

function updateFontSize(value) {

  if (editorStore.selectedElementId) {
    editorStore.updateElementProperty(editorStore.selectedElementId, 'fontSize', parseFloat(value) || 16);
  }
}

function updateBackgroundColor(value) {

  if (editorStore.selectedElementId) {
    editorStore.updateElementProperty(editorStore.selectedElementId, 'backgroundColor', value);
  }
}

// Adicione esta função no script do Inspector.vue
function updateActionMessage(message) {
  if (!editorStore.selectedElementId) return;
  // Cria o objeto de ação apenas se houver uma mensagem
  const action = message ? { type: 'alert', message: message } : null;
  editorStore.updateElementProperty(editorStore.selectedElementId, 'action', action);
}

function updateProperty(property, value) {
  if (editorStore.selectedElementId) {
    editorStore.updateElementProperty(editorStore.selectedElementId, property, value);
  }
}
</script>

<style scoped>
.inspector-panel {
  width: 280px;
  background-color: #ffffff;
  padding: 15px;
  border-left: 1px solid #dfe1e5;
  color: #333;
  overflow-y: auto;
  max-height: 100vh;
}
</style>
