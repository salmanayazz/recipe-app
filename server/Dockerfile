FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# remove files not needed in production
RUN rm -rf src
RUN rm -rf test
RUN rm -rf .git
RUN rm -rf .gitignore
RUN rm -rf tsconfig.json
RUN rm -rf Dockerfile
RUN rm -rf .dockerignore

EXPOSE 3000

ENV NODE_ENV=production

RUN npm prune --omit=dev

RUN npm cache clean --force

CMD ["npm", "run", "start:prod"]