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
    
    // Incluindo todos os estilos inline para garantir que funcionem
    const style = `
      position: absolute; 
      left: ${el.position.x}px; 
      top: ${el.position.y}px;
      font-size: ${props.fontSize || 16}px;
      background-color: ${props.backgroundColor || 'white'};
      color: ${props.color || props.fontColor || '#000000'};
      border: 2px solid #007bff;
      padding: 12px;
      border-radius: 6px;
      box-sizing: border-box;
      min-width: 100px;
      text-align: center;
    `.replace(/\s+/g, ' ').trim();
    
    return `<div id="${el.id}" class="element" style="${style}">${textContent}</div>`;
  }).join('\n');
  
  return `<!DOCTYPE html>
<html>
<head>
  ${head}
</head>
<body>
  ${body}
</body>
</html>`;
}

function generateCSS(elements) {
  const baseStyles = `
body { 
  margin: 0; 
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.element { 
  position: absolute;
  cursor: default;
  user-select: text;
  transition: box-shadow 0.2s ease;
}

.element:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
`;

  const elementStyles = elements.map(el => {
    const props = el.properties;
    return `
#${el.id} {
  /* Styles específicos do elemento */
}`;
  }).join('\n');
  
  return baseStyles + elementStyles;
}

module.exports = { generateHTML, generateCSS };
