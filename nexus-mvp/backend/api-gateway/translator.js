function generateHTML(elements) {
  const head = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Publicada</title>
    <link rel="stylesheet" href="style.css">
  `;
  const body = elements.map(el => {
    // Tratamento especial para imagens
    if (el.type === 'Image') {
      return `<img id="${el.id}" class="element image-element" 
              src="${el.properties.src || 'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Imagem+Publicada'}" 
              alt="${el.properties.alt || 'Imagem'}" 
              onerror="this.src='https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Erro+Publicacao'" />`;
    }
    
    // Elementos padrão (texto)
    const textContent = el.properties.text || el.type;
    return `<div id="${el.id}" class="element">${textContent}</div>`;
  }).join('\n');
  
  return `<!DOCTYPE html><html><head>${head}</head><body>${body}<script src="script.js"></script></body></html>`;
}

function generateCSS(elements) {
  const baseStyles = `
body { 
  margin: 0; 
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
.element { 
  position: absolute; 
  box-sizing: border-box; 
}`;

  const elementStyles = elements.map(el => {
    const props = el.properties;
    
    // Estilos específicos para imagens
    if (el.type === 'Image') {
      return `
#${el.id} {
  left: ${el.position.x}px;
  top: ${el.position.y}px;
  width: ${props.width || 300}px;
  height: ${props.height || 200}px;
  object-fit: ${props.objectFit || 'cover'};
  border-radius: ${props.borderRadius || 8}px;
  border: none;
}`;
    }
    
    // Estilos padrão para outros elementos
    return `
#${el.id} {
  left: ${el.position.x}px;
  top: ${el.position.y}px;
  font-size: ${props.fontSize || 16}px;
  background-color: ${props.backgroundColor || 'transparent'};
  color: ${props.color || props.fontColor || '#000000'};
  border: 1px solid #333;
  padding: 10px;
  border-radius: ${props.borderRadius || 6}px;
}`;
  }).join('\n');
  
  return baseStyles + elementStyles;
}

function generateJS(elements) {
  const interactiveElements = elements.filter(el => el.properties.action);

  const eventListeners = interactiveElements.map(el => {
    const action = el.properties.action;
    if (action && action.type === 'alert') {
      return `
        const element_${el.id} = document.getElementById('${el.id}');
        if (element_${el.id}) {
          element_${el.id}.addEventListener('click', () => {
            alert(\`${action.message}\`);
          });
        }`;
    }
    return '';
  }).join('\n');
  return `document.addEventListener('DOMContentLoaded', () => {${eventListeners}});`;
}

module.exports = { generateHTML, generateCSS, generateJS };
