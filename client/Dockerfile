FROM node:16-alpine as builder
WORKDIR /app
COPY . .
RUN npm install --omit=dev
RUN npm run build

FROM nginx:1.25
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html