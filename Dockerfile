FROM node:12.19.0

RUN mkdir -p /app/src

WORKDIR /app/src

COPY package.json .

COPY . .

RUN rm -rf node_modules

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]

VOLUME -public:/app/src/public