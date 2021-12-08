FROM node:16-alpine AS builder

# Use /usr/src/app as our workdir. The following instructions will be executed in this location.
WORKDIR /usr/src/app

COPY . .

RUN npm ci && \
        npm run build

FROM node:16-alpine
COPY --from=builder /usr/src/app/build /build

RUN adduser -D appuser && \
        npm install -g serve
USER appuser

CMD serve -s -l 5000 /build