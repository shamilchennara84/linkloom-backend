FROM nginx:1.23-alpine

COPY ./.docker/nginx/site.conf /etc/nginx/conf.d/default.conf