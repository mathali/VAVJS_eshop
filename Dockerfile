FROM node:latest
WORKDIR D:\\Dokumenty\\FIIT\\5. semester\\VAVJS\\e-shop
# RUN npm install npm
COPY package*.json ./
RUN npm install
COPY * ./
EXPOSE 8080
CMD [ "node", "server.js" ]