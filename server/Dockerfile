FROM node:16-alpine
WORKDIR /app
COPY . .
RUN npm install --omit=dev
EXPOSE 3001
CMD ["node", "./index.js"]