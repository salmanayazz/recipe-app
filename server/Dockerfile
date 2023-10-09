FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install nodemon globally
RUN npm install nodemon -g

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Exports
EXPOSE 3000

CMD ["npm", "start"]