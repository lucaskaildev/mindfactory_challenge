ARG NODE_VERSION=24-alpine3.21
ARG BACKEND_PORT=5000

FROM node:${NODE_VERSION}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000 

CMD ["node", "dist/main.js"]
