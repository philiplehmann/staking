FROM bitnami/node:18 AS builder
WORKDIR /app
COPY . .
RUN yarn install --immutable && \
    yarn build

# Production image, copy all the files and run next
FROM bitnami/node:18 AS runner
WORKDIR /app

RUN useradd -r staking && \
    mkdir -p /tmp/.yarn-cache && chown -R staking:staking /tmp/.yarn-cache && \
    mkdir -p /home/staking/.cache/yarn && chown -R staking:staking /home/staking && \
    touch yarn-error.log && chown -R staking:staking yarn-error.log

COPY --from=builder --chown=staking:staking /app/package.json ./package.json
COPY --from=builder --chown=staking:staking /app/yarn.lock ./yarn.lock
COPY --from=builder --chown=staking:staking /app/.next ./.next
COPY --from=builder --chown=staking:staking /app/node_modules ./node_modules

USER staking

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node", "node_modules/.bin/next", "start"]
