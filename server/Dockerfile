# bullseye used to make mongodb-memory-server work
FROM node:18-bullseye AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm test

RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/ ./

# remove files not needed in production
RUN rm -rf src
RUN rm -rf test
RUN rm -rf .git
RUN rm -f .gitignore
RUN rm -f tsconfig.json
RUN rm -f Dockerfile
RUN rm -f .dockerignore

EXPOSE 3000

ENV NODE_ENV=production

RUN npm prune --production
RUN npm ci --only=production

RUN npm cache clean --force

CMD ["npm", "run", "start:prod"]