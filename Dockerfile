FROM node:12.19.0

RUN mkdir -p /app/src

WORKDIR /app/src

COPY package.json .

COPY . .

RUN rm -rf node_modules

RUN npm install

EXPOSE 3000

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && npm start

VOLUME -./public:/app/src/public