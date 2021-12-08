FROM node:16

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN rm -rf node_modules && \
        npm install

EXPOSE 3000
# npm start is the command to start the application in development mode
CMD ["npm", "start"]