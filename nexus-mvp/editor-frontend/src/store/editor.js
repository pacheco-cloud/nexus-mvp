import { defineStore } from 'pinia';

export const useEditorStore = defineStore('editor', {
  state: () => ({
    elements: [],
    selectedElementId: null,
  }),

  getters: {
    selectedElement: (state) => {
      if (!state.selectedElementId) return null;
      return state.elements.find(element => element.id === state.selectedElementId);
    },
    
    elementCount: (state) => state.elements.length,
  },

  actions: {
    addElement(type, position) {
      console.log('🚀 EditorStore addElement chamado!');
      console.log('📦 Tipo:', type, 'Posição:', position);

      const newElement = {
        id: Date.now(),
        type: type,
        position: {
          x: position.x,
          y: position.y,
        },
        properties: this.getDefaultProperties(type),
      };

      console.log('🆕 Novo elemento criado:', newElement);
      
      this.elements.push(newElement);
      this.selectedElementId = newElement.id; // Auto-seleciona o novo elemento
      
      console.log('📋 Estado atual dos elementos:', this.elements);
      console.log('🎯 Elemento selecionado:', this.selectedElementId);
    },

    selectElement(elementId) {
      console.log('🎯 Selecionando elemento ID:', elementId);
      this.selectedElementId = elementId;
      console.log('✅ Elemento selecionado:', this.selectedElement);
    },

    removeElement(elementId) {
      console.log('🗑️ Removendo elemento ID:', elementId);
      this.elements = this.elements.filter(element => element.id !== elementId);
      
      // Se o elemento removido estava selecionado, desseleciona
      if (this.selectedElementId === elementId) {
        this.selectedElementId = null;
      }
      
      console.log('📋 Estado após remoção:', this.elements);
    },

    updateElementPosition(elementId, newPosition) {
      const element = this.elements.find(el => el.id === elementId);
      if (element) {
        element.position = { ...newPosition };
        console.log('📍 Posição atualizada para elemento', elementId, ':', newPosition);
      }
    },

    updateElementProperty(elementId, propertyKey, value) {
      console.log('🔧 Store updateElementProperty chamado:', { elementId, propertyKey, value });
      
      const element = this.elements.find(el => el.id === elementId);
      if (element) {
        // Use Vue's reactivity system properly
        element.properties[propertyKey] = value;
        
        console.log('✅ Propriedade atualizada:', propertyKey, '=', value, 'para elemento', elementId);
        console.log('📊 Elemento atualizado:', element);
        console.log('📋 Estado completo dos elementos:', this.elements);
      } else {
        console.log('❌ Elemento não encontrado:', elementId);
      }
    },

    // Método helper para definir propriedades padrão baseadas no tipo
    getDefaultProperties(type) {
      const defaults = {
        Text: {
          text: 'Texto',
          fontSize: 16,
          color: '#000000',
          fontWeight: 'normal',
        },
        Button: {
          text: 'Botão',
          backgroundColor: '#007bff',
          color: '#ffffff',
          borderRadius: 4,
          padding: '8px 16px',
        },
        Input: {
          placeholder: 'Digite aqui...',
          type: 'text',
          borderColor: '#ccc',
          borderRadius: 4,
          padding: '8px',
        },
        Group: {
          backgroundColor: '#f8f9fa',
          borderColor: '#dee2e6',
          borderRadius: 4,
          padding: '16px',
          minWidth: 200,
          minHeight: 100,
        },
      };

      return defaults[type] || {};
    },
  },
});
