# Kokand University CMS — production image
FROM node:22-slim

ENV NODE_ENV=production
WORKDIR /app

# Bog'liqliklar (faqat production)
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Ilova kodi
COPY . .

# Yuklamalar uchun katalog (Volume mount nuqtasi)
RUN mkdir -p /data/uploads
ENV UPLOAD_DIR=/data/uploads

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
