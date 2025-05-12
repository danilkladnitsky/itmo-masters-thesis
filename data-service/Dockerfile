# Build stage
FROM oven/bun:1.2.13
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "run", "dev"]
