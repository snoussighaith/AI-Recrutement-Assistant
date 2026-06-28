# Image Node.js
FROM node:20-alpine

WORKDIR /app

# Copie package.json en premier
COPY package*.json .

# Installe les dépendances
RUN npm install

# Copie le code
COPY . .

# Build Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]