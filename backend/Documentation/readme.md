
# Creating the backend Server (TSC + Express)
1) mkdir backend
2) cd backend
3) npm init
4) npm i express 
5) npm i typescript ts-node @types/node @types/express --save-dev
6) npm i -D @types/express 
7) npx tsc --init
8) configure package.json scripts as per requirement 
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "nodemon --exec ts-node ./server.ts"
  },

9) now you can >> npm run "anyScript" 


