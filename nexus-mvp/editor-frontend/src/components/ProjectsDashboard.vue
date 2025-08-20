<template>
  <div class="dashboard-container">
    <div class="dashboard-box">
      <h1>Projetos Nexus</h1>
      
      <div class="new-project-section">
        <input 
          v-model="newProjectName" 
          type="text" 
          placeholder="Nome do novo projeto"
          @keyup.enter="createProject"
          :disabled="isCreating"
        />
        <button 
          @click="createProject" 
          :disabled="!newProjectName.trim() || isCreating"
        >
          {{ isCreating ? '⏳ Criando...' : 'Criar Novo Projeto' }}
        </button>
      </div>

      <hr />

      <h2>Carregar Projeto Existente</h2>
      <div v-if="editorStore.projects.length === 0">
        <p>Nenhum projeto encontrado.</p>
      </div>
      <ul v-else class="project-list">
        <li v-for="project in editorStore.projects" :key="project.id">
          <span>{{ project.name }} - <small>{{ new Date(project.created_at).toLocaleDateString() }}</small></span>
          <button @click="editorStore.loadProject(project.id)">Carregar</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useEditorStore } from '../store/editor.js';

const editorStore = useEditorStore();
const newProjectName = ref('');
const isCreating = ref(false);

// Ao montar o componente, busca a lista de projetos
onMounted(() => {
  editorStore.fetchProjects();
});

async function createProject() {
  if (!newProjectName.value.trim() || isCreating.value) return;
  
  isCreating.value = true;
  try {
    await editorStore.createNewProject(newProjectName.value.trim());
    newProjectName.value = '';
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
  } finally {
    isCreating.value = false;
  }
}
</script>

<style scoped>
/* Estilos para o dashboard... */
.dashboard-container { display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f2f5; }
.dashboard-box { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); width: 600px; }
.new-project-section { display: flex; gap: 10px; margin: 20px 0; }
input { flex-grow: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 10px 15px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer; }
button:disabled { background: #ccc; }
.project-list { list-style: none; padding: 0; }
.project-list li { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #eee; }
</style>
