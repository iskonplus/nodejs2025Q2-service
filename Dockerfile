FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/doc ./doc

COPY --from=builder /app/prisma ./prisma
COPY prisma.config.ts ./

EXPOSE 4000

CMD ["node", "dist/src/main.js"]
