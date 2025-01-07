FROM node:23-bookworm-slim AS base
RUN npm install --global pnpm
WORKDIR /app
COPY . .

FROM base AS build
RUN pnpm install --filter @tousinclus/frontend
RUN pnpm run --filter @tousinclus/frontend build

FROM build AS assets
RUN rm -rf node_modules && pnpm recursive exec -- rm -rf ./node_modules ./src

FROM base AS prodbuild
RUN pnpm install --prod --filter @tousinclus/frontend
COPY --from=assets /app .

FROM caddy:2.8.4-alpine AS prod
COPY --from=prodbuild /app /app
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
ENTRYPOINT ["caddy", "run", "--config", "/app/apps/frontend/Caddyfile"]
