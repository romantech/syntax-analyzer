FROM node:26-bookworm-slim AS build
WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/ packages/shared/
RUN npm install --global "$(node -p 'require("./package.json").packageManager')" \
    && pnpm --filter syntax-analyzer-api install --frozen-lockfile --ignore-scripts

COPY apps/api/tsconfig.json apps/api/tsconfig.json
COPY apps/api/src apps/api/src
RUN pnpm --filter syntax-analyzer-api build \
    && pnpm --filter syntax-analyzer-api --prod deploy /out

FROM node:26-bookworm-slim
WORKDIR /home/node

ENV NODE_ENV=production
ENV PORT=8000
EXPOSE 8000

COPY --from=build /out/package.json ./package.json
COPY --from=build /out/node_modules ./node_modules
COPY --from=build /workspace/apps/api/dist ./dist

USER node
CMD ["node", "-r", "module-alias/register", "dist/server.js"]
