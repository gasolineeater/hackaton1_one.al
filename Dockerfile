FROM node:18-alpine AS base

# Create app directory
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY api/package*.json ./
RUN npm ci --only=production

# Build the app
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY api ./

# Production image
FROM base AS runner
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 onealbania
USER onealbania

# Copy from builder
COPY --from=builder --chown=onealbania:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=onealbania:nodejs /app/server.js ./
COPY --from=builder --chown=onealbania:nodejs /app/config ./config
COPY --from=builder --chown=onealbania:nodejs /app/middleware ./middleware
COPY --from=builder --chown=onealbania:nodejs /app/models ./models
COPY --from=builder --chown=onealbania:nodejs /app/routes ./routes
COPY --from=builder --chown=onealbania:nodejs /app/services ./services
COPY --from=builder --chown=onealbania:nodejs /app/utils ./utils
COPY --from=builder --chown=onealbania:nodejs /app/scripts ./scripts
COPY --from=builder --chown=onealbania:nodejs /app/public ./public

# Create directories for logs and data
RUN mkdir -p logs
RUN mkdir -p tmp

# Set proper permissions
RUN chown -R onealbania:nodejs logs tmp
RUN chmod -R 755 config middleware models routes services utils scripts public
RUN chmod 755 server.js
RUN find node_modules -type d -exec chmod 755 {} \;
RUN find node_modules -type f -exec chmod 644 {} \;

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

# Run the app
CMD ["node", "server.js"]
