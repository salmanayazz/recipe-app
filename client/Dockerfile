FROM node:18 as builder

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

# production
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist .

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "."]

