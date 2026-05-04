cd docker
docker compose up

cd backend
npx prisma generate
npm run start: dev

cd backend
npm start