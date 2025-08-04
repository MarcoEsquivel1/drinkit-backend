FROM node:20-alpine AS development
WORKDIR /usr/src/app
COPY --chown=node:node package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY --chown=node:node . .
USER node

FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY --chown=node:node package*.json yarn.lock ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
ENV NODE_ENV=production
RUN yarn build
RUN yarn install --production --frozen-lockfile --ignore-scripts && yarn cache clean
USER node

FROM node:20-alpine AS production
ENV NODE_ENV=production
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./package.json
CMD [ "node", "dist/main.js" ] 