FROM node:18-alpine as builder
ARG PNPM_VERSION="8.6.1"
RUN npm install --location=global pnpm@${PNPM_VERSION}
RUN rm -fr /root/.npm
RUN rm -fr /opt/yarn-v1.22.19
RUN rm -fr /tmp/v8-compile-cache-0
RUN rm -fr /usr/local/lib/node_modules/npm
RUN rm -fr /usr/local/share

FROM node:18-alpine as runner
RUN rm -fr /root/.npm
RUN rm -fr /opt/yarn-v1.22.19
RUN rm -fr /tmp/v8-compile-cache-0
RUN rm -fr /usr/local/lib/node_modules
RUN rm -fr /usr/local/share

FROM builder as build
WORKDIR /web
COPY ./pnpm-lock.yaml . 
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile
ARG VITE_DEPLOY_COMMIT
ARG VITE_DEPLOY_TIMESTAMP
ENV VITE_DEPLOY_COMMIT=$VITE_DEPLOY_COMMIT
ENV VITE_DEPLOY_TIMESTAMP=$VITE_DEPLOY_TIMESTAMP
RUN pnpm run build
RUN pnpm run bundle-server
RUN pnpm run copy-assets

FROM builder as external
WORKDIR /web
RUN echo '{ "type": "module" }' > package.json
RUN pnpm install better-sqlite3

FROM runner
WORKDIR /web
COPY --from=external /web/node_modules node_modules
COPY --from=build /web/bundle bundle
ENV VITE_DEPLOY_COMMIT=$VITE_DEPLOY_COMMIT
ENV VITE_DEPLOY_TIMESTAMP=$VITE_DEPLOY_TIMESTAMP
ENTRYPOINT ["node", "bundle/index.js"]