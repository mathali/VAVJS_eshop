FROM node:latest
WORKDIR /usr/src/app
# RUN npm install npm
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY ./ ./
RUN npm run-script build
EXPOSE 8080
CMD [ "node", "server.js" ]