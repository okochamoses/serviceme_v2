FROM node:12.19.0-alpine3.10 

RUN mkdir -p /app/src

WORKDIR /app/src

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

VOLUME -public:/app/src/public