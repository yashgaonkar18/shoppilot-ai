FROM mirror.gcr.io/library/node:20-slim

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN rm -f .env
EXPOSE 8080
CMD ["node", "server.js"]