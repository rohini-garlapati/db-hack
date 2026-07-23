FROM node:20

RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm --filter @workspace/ai-dashboard build

EXPOSE 8080

CMD ["pnpm","--filter","@workspace/ai-dashboard","serve","--host","0.0.0.0","--port","8080"]
