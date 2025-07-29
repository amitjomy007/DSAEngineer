FROM node:22-alpine
WORKDIR /app
RUN echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.20/main" > /etc/apk/repositories && \
    echo "https://mirrors.tuna.tsinghua.edu.cn/alpine/v3.20/community" >> /etc/apk/repositories

RUN apk update && apk add --no-cache g++

COPY package*.json ./
RUN npm install
COPY . .

# Debug steps
RUN ls -la
RUN npx tsc --version
RUN npm run build
RUN ls -la dist/

EXPOSE 3000
CMD ["node", "dist/server.js"]
