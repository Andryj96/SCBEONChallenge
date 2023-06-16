FROM node:18

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/
COPY public ./public/

RUN npm install

RUN npx prisma generate

COPY . .

CMD ["npm", "run", "dev"]
