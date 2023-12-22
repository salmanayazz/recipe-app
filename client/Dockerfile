FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i && npm cache clean --force

COPY . .

EXPOSE 3000

CMD ["npm", "start"]