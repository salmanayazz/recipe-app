FROM node

# app working folder
WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./

RUN npm install

# install app
COPY . . 

EXPOSE 3000

# Run CMD
CMD ["npm", "run", "start"]