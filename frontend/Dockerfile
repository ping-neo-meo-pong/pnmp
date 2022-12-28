FROM node:latest
WORKDIR /frontend
COPY . .
RUN npm install
RUN npm run build
ENTRYPOINT npm run start
