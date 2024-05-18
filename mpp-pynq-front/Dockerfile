FROM node:alpine AS install-deps

ARG REACT_APP_API_URL

WORKDIR /app
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL" > .env

RUN yarn


FROM node:alpine AS build

ENV GENERATE_SOURCEMAP=false

WORKDIR /app

COPY . .
COPY --from=install-deps /app/node_modules /app/node_modules

RUN yarn build

FROM nginx:latest
COPY deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html