FROM node:alpine

EXPOSE 6666/tcp

VOLUME /node
RUN mkdir /node
WORKDIR /node

RUN npm install

CMD node build

FROM alpine:3.15.0
LABEL Author="Terry Zhang"
LABEL Version=0.0.1

