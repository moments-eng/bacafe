# Build stage for dependencies
FROM docker.io/node:lts-alpine as deps
RUN apk add --no-cache libc6-compat
WORKDIR /usr/src/app

# Copy package files for better layer caching
COPY package*.json ./
RUN npm ci --omit=dev

# Runner stage
FROM docker.io/node:lts-alpine as runner
RUN apk add --no-cache dumb-init curl

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /usr/src/app
RUN addgroup -g 1001 nodejs && \
    adduser -S -u 1001 -G nodejs nodejs && \
    chown -R nodejs:nodejs /usr/src/app

COPY --from=deps --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=deps --chown=nodejs:nodejs /usr/src/app/package.json ./package.json
COPY --chown=nodejs:nodejs dist ./dist

USER nodejs

EXPOSE $PORT

# Use dumb-init as PID 1
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
