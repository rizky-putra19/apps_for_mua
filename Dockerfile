FROM node:14-alpine AS development

WORKDIR /app

COPY package.json yarn.lock ./


RUN yarn install

COPY . .

RUN yarn build

FROM node:14-alpine as production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package.json yarn.lock  ./

RUN yarn install --production

COPY . .

COPY --from=development /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/src/main"]

