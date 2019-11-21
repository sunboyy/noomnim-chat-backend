FROM node:12-alpine
COPY . /app
WORKDIR /app
RUN npm install
RUN sed -i 's/localhost:3000/backend:3000/' config/gateway.config.yml && \
    sed -i 's/localhost:3010/group:3010/' config/gateway.config.yml && \
    sed -i 's/localhost:4200/frontend/' config/gateway.config.yml
EXPOSE 8080
CMD [ "node", "server.js" ]
