FROM node:20

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm build

EXPOSE 8080

CMD ["pnpm","serve","--host","0.0.0.0","--port","8080"]
