FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:24-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
