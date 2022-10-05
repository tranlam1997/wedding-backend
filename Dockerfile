FROM node:16.14.2-slim

RUN mkdir -p /app
WORKDIR /app
ADD ./ /app
RUN npm install
ENV HOST 0.0.0.0
EXPOSE 5000

CMD ["node", "index.js"]