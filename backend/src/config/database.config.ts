// PostgreSQL database configuration using TypeORM
const host = process.env.DB_HOST || 'localhost'
export const DATABASE_URL=`postgresql://postgres:postgres@${host}:5432/notification`
