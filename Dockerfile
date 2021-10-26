FROM node:16-alpine AS builder
WORKDIR /usr/src/node-builder
COPY . .
RUN npm install && \
    npm run build && \
    mkdir ./builder && \
    mv ./build ./builder/build && \
    mv ./tsconfig.json ./builder/tsconfig.json && \
    mv ./package.json ./builder/package.json

FROM node:16-alpine
WORKDIR /home/runner/project
COPY --from=builder /usr/src/node-builder/builder .
RUN addgroup -S runner && \
    adduser -S runner -G runner -s /bin/false && \
    chown -R runner:runner /home/runner
USER runner
RUN npm install --production
CMD npm run production
