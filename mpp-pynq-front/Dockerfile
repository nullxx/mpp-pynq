FROM node:alpine AS install-deps

WORKDIR /app
COPY mpp-front/package.json package.json
COPY mpp-front/yarn.lock yarn.lock
RUN yarn


FROM node:alpine AS build

ENV GENERATE_SOURCEMAP=false

WORKDIR /app

COPY mpp-front .
COPY --from=install-deps /app/node_modules /app/node_modules

RUN yarn build

FROM nginx:latest
COPY deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
COPY build-out /usr/share/nginx/html