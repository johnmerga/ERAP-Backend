FROM node:18.4.0-alpine3.16 AS development
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

FROM node:18.4.0-alpine3.16 AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install --omit=dev
COPY --from=development /usr/src/app/dist ./dist
COPY nginx.conf .
CMD [ "node", "dist/server.js" ]