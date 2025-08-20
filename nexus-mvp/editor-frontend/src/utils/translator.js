// translator.js ATUALIZADO

function generateHTML(elements) {
  const head = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Publicada</title>
    <link rel="stylesheet" href="style.css">
  `;
  const body = elements.map(el => {
    const textContent = el.properties.text || el.type;
    const props = el.properties;
    
    // Gera estilo inline COMPLETO para o elemento
    const style = `
      position: absolute; 
      left: ${el.position.x}px; 
      top: ${el.position.y}px;
      font-size: ${props.fontSize || 16}px;
      background-color: ${props.backgroundColor || 'white'};
      color: ${props.fontColor || '#000000'};
      border: 2px solid #007bff;
      padding: 12px;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      min-width: 100px;
      text-align: center;
      box-sizing: border-box;
      cursor: ${props.action ? 'pointer' : 'default'};
    `.replace(/\s+/g, ' ').trim();
    
    return `<div id="${el.id}" class="element" style="${style}">${textContent}</div>`;
  }).join('\n');
  
  // Adicionamos a tag <script> no final do body
  return `<!DOCTYPE html><html><head>${head}</head><body>${body}<script src="script.js"></script></body></html>`;
}

function generateCSS(elements) {
  const baseStyles = `
body { 
  margin: 0; 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8f9fa;
}
.element { 
  position: absolute; 
  box-sizing: border-box; 
  transition: all 0.3s ease;
  user-select: none;
}

.element:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
  transform: translateY(-1px);
}

/* Media queries para responsividade */
@media screen and (max-width: 768px) {
  .element {
    transform: scale(0.9);
    transform-origin: top left;
  }
}

@media screen and (max-width: 375px) {
  .element {
    transform: scale(0.8);
    transform-origin: top left;
  }
}
`;

  const elementStyles = elements.map(el => {
    const props = el.properties;
    const baseFontSize = props.fontSize || 16;
    
    return `
#${el.id} {
  font-size: ${baseFontSize}px;
  background-color: ${props.backgroundColor || 'white'};
  color: ${props.fontColor || '#000000'};
  border: 2px solid #007bff;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  min-width: 100px;
  text-align: center;
  cursor: ${props.action ? 'pointer' : 'default'};
}

#${el.id}:hover {
  border-color: #0056b3;
}

#${el.id}:active {
  transform: scale(0.98);
}

/* Responsividade específica do elemento */
@media screen and (max-width: 768px) {
  #${el.id} {
    font-size: ${Math.round(baseFontSize * 0.9)}px;
  }
}

@media screen and (max-width: 375px) {
  #${el.id} {
    font-size: ${Math.round(baseFontSize * 0.8)}px;
  }
}`;
  }).join('\n');
  
  return baseStyles + elementStyles;
}

// NOVA FUNÇÃO
function generateJS(elements) {
  // Filtra apenas os elementos que têm uma ação definida
  const interactiveElements = elements.filter(el => el.properties.action);

  const eventListeners = interactiveElements.map(el => {
    const action = el.properties.action;
    
    // Por enquanto, só lidamos com a ação 'alert'
    if (action && action.type === 'alert') {
      return `
        const element_${el.id} = document.getElementById('${el.id}');
        if (element_${el.id}) {
          element_${el.id}.addEventListener('click', () => {
            alert(\`${action.message}\`);
          });
        }
      `;
    }
    return ''; // Retorna string vazia para outros casos
  }).join('\n');

  // Garante que o script rode apenas depois que a página carregar
  return `document.addEventListener('DOMContentLoaded', () => {${eventListeners}});`;
}

// Exporta usando sintaxe ES6 para o frontend
export { generateHTML, generateCSS, generateJS };
