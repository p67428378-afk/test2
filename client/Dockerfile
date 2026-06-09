# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config to support SPA routing if needed, or just standard
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
