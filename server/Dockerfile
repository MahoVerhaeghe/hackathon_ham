FROM node:18.13.0

WORKDIR /app
RUN mkdir src
COPY src ./src

COPY package.json /app/
COPY nodemon.json /app/
COPY .env /app/
COPY .babelrc /app/
COPY .prettierrc /app/
COPY .eslintrc.json /app/ 
COPY client_secret_1071194548646-nof2m91987p31ee13bsptc0jh66m6dio.apps.googleusercontent.com.json /app/
RUN npm install

CMD [ "npm", "run", "startdev" ]
