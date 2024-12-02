# Utiliser l'image de base
FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Étape de production : installer les dépendances et préparer le build
FROM base AS prod

COPY pnpm-lock.yaml /app
WORKDIR /app
RUN pnpm fetch --prod

COPY . /app
RUN pnpm run build:storybook  # Commande de build spécifique pour Storybook

# Étape finale : préparer le conteneur pour l'exécution de Storybook
FROM base
COPY --from=prod /app/node_modules /app/node_modules
COPY --from=prod /app/public /app/public
COPY --from=prod /app/dist /app/dist
EXPOSE 6006
CMD [ "pnpm", "storybook" ]
