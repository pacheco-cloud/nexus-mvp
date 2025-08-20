<template>
  <div id="nexus-app">
    <header class="app-header">
      <h1>Nexus Editor MVP</h1>
      <button @click="publishPage" class="publish-button">
        🚀 Publicar
      </button>
    </header>
    <main class="editor-main">
      <Toolbox />
      <Canvas />
      <Inspector />
    </main>
  </div>
</template>

<script setup>
import Toolbox from './components/Toolbox.vue'
import Canvas from './components/Canvas.vue'
import Inspector from './components/Inspector.vue'
import { useEditorStore } from './store/editor.js'

const editorStore = useEditorStore();

async function publishPage() {
  console.log('Publicando página...');
  
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
    console.error('Falha ao publicar a página:', error);
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

.app-header h1 {
  font-size: 18px;
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

.editor-main {
  display: flex;
  flex-grow: 1;
  /* Ocupa o resto da altura */
}
</style>
