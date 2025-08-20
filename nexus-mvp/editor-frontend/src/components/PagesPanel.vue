<template>
  <div class="pages-panel">
    <div class="header">
      <h4>Páginas</h4>
      <button @click="toggleAddPage" class="add-button">+</button>
    </div>

    <div v-if="isAddingPage" class="add-page-form">
      <input
        v-model="newPageName"
        @keyup.enter="createPage"
        placeholder="Nome da nova página"
        ref="pageNameInput"
      />
      <button @click="createPage">Criar</button>
      <button @click="cancelAddPage" class="cancel-button">✕</button>
    </div>

    <ul class="pages-list" v-if="editorStore.pages.length > 0">
      <li
        v-for="page in editorStore.pages"
        :key="page.id"
        @click="editorStore.loadPage(page.id)"
        :class="{ active: editorStore.currentPageId === page.id }"
      >
        <span class="page-icon">📄</span>
        <span class="page-name">{{ page.name }}</span>
      </li>
    </ul>

    <div v-else class="empty-state">
      <p>Nenhuma página criada</p>
      <p class="help-text">Clique em + para criar sua primeira página</p>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useEditorStore } from '../store/editor.js';

const editorStore = useEditorStore();
const isAddingPage = ref(false);
const newPageName = ref('');
const pageNameInput = ref(null);

function toggleAddPage() {
  isAddingPage.value = !isAddingPage.value;
  newPageName.value = '';
  
  if (isAddingPage.value) {
    nextTick(() => {
      pageNameInput.value?.focus();
    });
  }
}

function cancelAddPage() {
  isAddingPage.value = false;
  newPageName.value = '';
}

async function createPage() {
  if (!newPageName.value.trim()) return;
  
  console.log(`🌟 Criando nova página: ${newPageName.value}`);
  await editorStore.createNewPage(newPageName.value);
  newPageName.value = '';
  isAddingPage.value = false;
}
</script>

<style scoped>
.pages-panel {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.header h4 {
  margin: 0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
}

.add-button {
  background: #28a745;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.add-button:hover {
  background: #218838;
  transform: scale(1.1);
}

.add-page-form {
  display: flex;
  gap: 5px;
  margin: 10px 0;
  flex-wrap: wrap;
}

.add-page-form input {
  flex: 1;
  min-width: 120px;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
}

.add-page-form button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-page-form button:first-of-type {
  background: #007bff;
  color: white;
}

.add-page-form button:first-of-type:hover {
  background: #0056b3;
}

.cancel-button {
  background: #dc3545 !important;
  color: white !important;
}

.cancel-button:hover {
  background: #c82333 !important;
}

.pages-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pages-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 2px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.pages-list li:hover {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.pages-list li.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.pages-list li.active .page-icon {
  filter: brightness(0) invert(1);
}

.page-icon {
  font-size: 14px;
}

.page-name {
  font-size: 13px;
  font-weight: 500;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  text-align: center;
  padding: 20px 10px;
  color: #6c757d;
}

.empty-state p {
  margin: 5px 0;
  font-size: 13px;
}

.help-text {
  font-size: 11px !important;
  color: #adb5bd !important;
}
</style>
