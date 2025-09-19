# taken from https://docs.docker.com/guides/angular/containerize/
# =========================================
# Stage 1: Build the Angular Application
# =========================================
ARG NODE_VERSION=24-alpine3.21
ARG NGINX_VERSION=alpine3.22
ARG FRONTEND_PORT=9090

# Use a lightweight Node.js image for building (customizable via ARG)
FROM node:${NODE_VERSION} AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY package*.json ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Build the Angular application
RUN npm run build

# =========================================
# Stage 2: Prepare Nginx to Serve Static Files
# =========================================

# Install gettext for envsubst
RUN apk add --no-cache gettext

FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

# Use a built-in non-root user for security best practices
USER nginx

# Copy custom Nginx config template
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template

# Replace with envsubst to substitute environment variables in the Nginx config template
CMD ["envsubst", "</etc/nginx/nginx.conf.template", ">/etc/nginx/nginx.conf"]

# Copy the static build output from the build stage to Nginx's default HTML serving directory
COPY --chown=nginx:nginx --from=builder /app/dist/*/browser /usr/share/nginx/html

EXPOSE ${FRONTEND_PORT}

# Start Nginx directly with custom config
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
