# Estágio 1: Instalar dependências
FROM node:18-alpine
WORKDIR /app

# Copiar e instalar dependências primeiro
COPY package*.json ./
RUN npm install

# Copiar o resto do código
COPY . .

# Expor a porta e iniciar
EXPOSE 3000
CMD ["node", "server.js"]
