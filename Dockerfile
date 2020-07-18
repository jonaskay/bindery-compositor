FROM node:12.8

RUN mkdir /app
WORKDIR /app

RUN curl https://sdk.cloud.google.com | bash
ENV PATH $PATH:/root/google-cloud-sdk/bin

COPY package.json /app/package.json
COPY /compositor-engine/package.json /app/compositor-engine/package.json
COPY /compositor-template/package.json /app/compositor-template/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn --pure-lockfile --no-cache

COPY . /app

CMD ["yarn", "workspace", "compositor-engine", "start"]
