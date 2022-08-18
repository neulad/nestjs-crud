FROM node:16
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY . ./
RUN npm install -g @nestjs/cli
RUN npm run build
CMD ["npm", "run", "start:prod"]

