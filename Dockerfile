# # Frontend Dockerfile - Node.js environment only
# FROM node:20-alpine

# WORKDIR /app

# # Install basic tools
# RUN apk add --no-cache git

# # Expose port for development
# EXPOSE 3000

# # Keep container running so you can exec into it
# CMD ["tail", "-f", "/dev/null"]
# Frontend Dockerfile - Node.js environment
FROM node:20-alpine

# Làm việc trong /app
WORKDIR /app

# Cài thêm vài tool hay cần
RUN apk add --no-cache bash git openssh

# Copy file package trước để cache layer npm install
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Expose port cho Next.js
EXPOSE 3000

# Run dev server (hot reload)
CMD ["tail", "-f", "/dev/null"]
