FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ============================================
# Dependencies Stage
# ============================================
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ============================================
# Builder Stage
# ============================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ============================================
# Production Runner Stage
# ============================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy i18n messages directory
COPY --from=builder --chown=nextjs:nodejs /app/src/i18n ./src/i18n

# Also copy any other runtime dependencies
# COPY --from=builder --chown=nextjs:nodejs /app/other-runtime-files ./other-runtime-files

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
