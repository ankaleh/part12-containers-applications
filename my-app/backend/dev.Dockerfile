FROM node:16

USER node
  
WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN rm -rf node_modules && \
        npm install && \
            npm uninstall bcrypt && \
                npm install bcrypt

EXPOSE 4000
ENV DEBUG=playground:*
ENV MONGODB_URI=${MONGODB_URI}
ENV SECRET=${SECRET}

CMD ["npm", "run", "dev"]