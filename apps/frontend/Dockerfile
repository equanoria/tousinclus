FROM debian:bookworm-slim

RUN apt update && apt install -y nodejs npm && \
  apt clean && \
  rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

COPY . ./app
WORKDIR /app

RUN pnpm install && \
  pnpm run build && \
  rm -rf node_modules

ENV PORT=3000
ENV NODE_ENV=production

RUN pnpm install

EXPOSE ${PORT}

CMD ["pnpm", "run", "start:prod"]
