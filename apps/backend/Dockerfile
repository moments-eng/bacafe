# Development Stage
FROM node:20-alpine AS development

WORKDIR /usr/src/app

# Install curl for healthcheck
RUN apk add --no-cache curl

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production Stage
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Install curl for healthcheck
RUN apk add --no-cache curl

COPY package*.json ./

RUN npm ci --only=production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
