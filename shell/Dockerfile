FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG CATALOG_URL=http://localhost/catalog
ARG CART_URL=http://localhost/cart
ARG PROFILE_URL=http://localhost/profile
ENV CATALOG_URL=$CATALOG_URL
ENV CART_URL=$CART_URL
ENV PROFILE_URL=$PROFILE_URL

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx-spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
