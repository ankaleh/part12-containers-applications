FROM node:16

USER node
  
WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

EXPOSE 4000

CMD npm start