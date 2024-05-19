FROM --platform=linux/amd64 node:22-alpine3.19 AS install-deps

WORKDIR /app
COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml

RUN npm install -g pnpm && pnpm install


FROM --platform=linux/amd64 node:22-alpine3.19 AS build

ENV GENERATE_SOURCEMAP=false

WORKDIR /app

COPY . .
COPY --from=install-deps /app/node_modules /app/node_modules

RUN npm run build

FROM nginx:latest
COPY deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html