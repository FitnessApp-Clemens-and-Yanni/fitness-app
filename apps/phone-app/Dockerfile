FROM node:23-alpine

WORKDIR /app

COPY package.json package.json ./
RUN npm install --frozen-lockfile

COPY . .

EXPOSE 8080

CMD ["npm", "run", "web"]