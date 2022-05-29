FROM node:16-alpine AS build
COPY . /app
WORKDIR /app
ENV CI=true
RUN yarn && yarn test && yarn build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
