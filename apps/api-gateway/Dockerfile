FROM node:14-alpine

WORKDIR /usr/src/app
COPY package-lock.json /usr/src/app
COPY package.json /usr/src/app
RUN npm ci --only=prod
RUN npm i ts-node typescript tslib
COPY dist/apps/api-gateway /usr/src/app

EXPOSE 3333
ENTRYPOINT ["node", "./main.js"]
