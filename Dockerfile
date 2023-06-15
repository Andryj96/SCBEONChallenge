FROM node:18

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/
COPY public ./public/

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
