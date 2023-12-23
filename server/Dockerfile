FROM node:21-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm i && npm cache clean --force

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
