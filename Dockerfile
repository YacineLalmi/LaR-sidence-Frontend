# ------------------------
# Stage 1: Base Image
# ------------------------
FROM node:22.21.1-alpine3.23 AS base
USER root
WORKDIR /app

# ------------------------
# Stage 2: Dependencies
# ------------------------
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ------------------------
# Stage 3: Build the App
# ------------------------
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ------------------------
# Stage 4: Production Runner
# ------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user (RHEL way)
RUN groupadd -r nodejs \
  && useradd -r -g nodejs nodejs

# Copy only what’s needed for runtime
COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

RUN chmod -R 777 ./.next

USER nodejs
ENV NODE_TLS_REJECT_UNAUTHORIZED 0
# EXPOSE 3000

CMD ["npm", "start"]
