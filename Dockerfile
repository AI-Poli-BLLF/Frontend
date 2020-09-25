# uso serve come server per non dover impostare un proxy
# anche se non è la migliore sotto l'aspetto delle performance

FROM node:12.18.4

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@9.1.6

# add app
COPY . /app

# start app
CMD ng serve --host 0.0.0.0
