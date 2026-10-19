FROM node:24-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Copier le reste du code frontend
COPY . .

EXPOSE 5173

# Lancer en mode dev (ajuste selon ton bundler, ex: vite ou react-scripts)
CMD ["npm", "run", "dev", "--", "--host"]