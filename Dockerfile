FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "dist/index.js" ]