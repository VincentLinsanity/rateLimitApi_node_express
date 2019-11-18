FROM node:12-slim as builder

WORKDIR /usr/app

COPY ./package.json .

RUN npm install --production


FROM node:12-slim

WORKDIR /usr/app

COPY --from=builder /usr/app/node_modules ./node_modules
COPY . .

EXPOSE 3001
CMD ["node", "server.js"]