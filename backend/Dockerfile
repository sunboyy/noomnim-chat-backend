FROM node:12-alpine
COPY . /app
WORKDIR /app
RUN npm install && npm run build

FROM node:12-alpine
COPY --from=0 /app/public /app/public
COPY --from=0 /app/dist /app/dist
COPY --from=0 /app/package.json /app/package.json
COPY --from=0 /app/package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install --only=prod
EXPOSE 3000
CMD ["node", "dist/app.js"]
