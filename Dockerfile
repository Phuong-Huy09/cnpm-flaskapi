# Frontend Dockerfile - Node.js environment only
FROM node:20-alpine

WORKDIR /app

# Install basic tools
RUN apk add --no-cache git

# Expose port for development
EXPOSE 3000

# Keep container running so you can exec into it
CMD ["tail", "-f", "/dev/null"]
