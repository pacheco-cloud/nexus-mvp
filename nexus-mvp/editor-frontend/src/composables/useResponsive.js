import { computed } from 'vue';
import { useEditorStore } from '../store/editor.js';

export function useResponsive() {
  const editorStore = useEditorStore();

  // Dimensões atuais do canvas
  const currentDimensions = computed(() => {
    return editorStore.getCurrentDimensions();
  });

  // Converte posição absoluta para responsiva - VERSÃO SIMPLIFICADA
  function getResponsiveStyle(element) {
    const mode = editorStore.previewMode;
    const baseDimensions = editorStore.baseDimensions;
    
    // Sempre usa desktop como referência
    const desktopWidth = baseDimensions.desktop.width;
    const desktopHeight = baseDimensions.desktop.height;
    
    // Dimensões do modo atual
    const currentWidth = baseDimensions[mode].width;
    const currentHeight = baseDimensions[mode].height;
    
    // Calcula proporção
    const scaleX = currentWidth / desktopWidth;
    const scaleY = currentHeight / desktopHeight;
    
    // Aplica escala às posições originais
    const scaledX = Math.round(element.position.x * scaleX);
    const scaledY = Math.round(element.position.y * scaleY);
    
    // Calcula fonte responsiva
    const baseFontSize = element.properties.fontSize || 16;
    const scaledFontSize = Math.round(baseFontSize * scaleX);
    
    console.log(`📱 ${mode.toUpperCase()}: ${element.id} de (${element.position.x},${element.position.y}) para (${scaledX},${scaledY})`);
    
    return {
      position: 'absolute',
      left: `${scaledX}px`,
      top: `${scaledY}px`,
      fontSize: `${scaledFontSize}px`,
    };
  }

  // Calcula largura responsiva para containers
  function getContainerWidth() {
    const mode = editorStore.previewMode;
    const dimensions = editorStore.baseDimensions[mode];
    
    if (mode === 'desktop') {
      return '100%';
    }
    
    return `${dimensions.width}px`;
  }

  // Calcula altura responsiva para containers
  function getContainerHeight() {
    const mode = editorStore.previewMode;
    const dimensions = editorStore.baseDimensions[mode];
    
    if (mode === 'desktop') {
      return '100%';
    }
    
    return `${dimensions.height}px`;
  }

  // Verifica se está em modo mobile
  const isMobile = computed(() => editorStore.previewMode === 'mobile');
  const isTablet = computed(() => editorStore.previewMode === 'tablet');
  const isDesktop = computed(() => editorStore.previewMode === 'desktop');

  return {
    currentDimensions,
    getResponsiveStyle,
    getContainerWidth,
    getContainerHeight,
    isMobile,
    isTablet,
    isDesktop,
  };
}
