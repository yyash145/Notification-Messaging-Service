# Use official Node image
FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

RUN npm install

# Copy backend source
COPY backend .

RUN npx prisma generate
RUN npm run build

CMD ["node", "dist/main.js"]