FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run tsc

EXPOSE 3000

CMD [ "node", "dist/index.js" ]
