// Secrets, expiry time and other JWT related configurations
export const jwtConfig = {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '3600s', // default to 1 hour
    },
};