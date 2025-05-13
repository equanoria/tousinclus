FROM node:23-bookworm-slim AS base
RUN npm install --global pnpm
WORKDIR /app
COPY . .

FROM base AS build
RUN pnpm install --frozen-lockfile --filter @tousinclus/types
RUN pnpm install --frozen-lockfile --filter @tousinclus/backend
RUN pnpm run --filter @tousinclus/types build
RUN pnpm run --filter @tousinclus/backend build

FROM build AS assets
RUN rm -rf node_modules && pnpm recursive exec -- rm -rf ./node_modules ./src

FROM base AS prod
RUN pnpm install --frozen-lockfile --prod --filter @tousinclus/backend
COPY --from=assets /app .

EXPOSE 3000
ENTRYPOINT ["pnpm", "run", "--filter", "@tousinclus/backend", "start:prod"]
