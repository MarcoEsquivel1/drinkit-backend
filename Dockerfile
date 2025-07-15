FROM node:20-bookworm AS base
RUN apt-get update -qq && apt-get install -y pkg-config build-essential curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app
COPY package.json yarn.lock ./

FROM base AS dependencies
ENV CI=true
RUN yarn install --production
RUN cp -R node_modules prod_node_modules
RUN yarn install

FROM base AS development
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 3000

FROM base AS build
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM base AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
COPY --from=dependencies /usr/src/app/prod_node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package.json ./

RUN addgroup --gid 1001 --system nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["yarn", "start:prod"] 