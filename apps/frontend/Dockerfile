FROM node:24-bookworm-slim AS base
RUN npm install --global pnpm
WORKDIR /app
COPY . .

FROM base AS build
RUN pnpm install --frozen-lockfile --filter @tousinclus/types
RUN pnpm install --frozen-lockfile --filter @tousinclus/frontend
RUN pnpm run --filter @tousinclus/types build
RUN pnpm run --filter @tousinclus/frontend build

FROM build AS assets
RUN rm -rf node_modules && pnpm recursive exec -- rm -rf ./node_modules ./src

FROM base AS prodbuild
RUN pnpm install --frozen-lockfile --prod --filter @tousinclus/frontend
COPY --from=assets /app .

FROM caddy:2.10.0-alpine AS prod
COPY --from=prodbuild /app /app
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
ENTRYPOINT ["caddy", "run", "--config", "/app/apps/frontend/Caddyfile"]
