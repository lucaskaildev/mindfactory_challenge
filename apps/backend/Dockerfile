ARG NODE_VERSION=24-alpine3.21
ARG BACKEND_PORT=5000

FROM node:${NODE_VERSION}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env ./

RUN npm run build

EXPOSE ${BACKEND_PORT}

CMD ["node", "dist/main.js"]
