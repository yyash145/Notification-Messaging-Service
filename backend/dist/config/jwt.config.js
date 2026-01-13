"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
exports.jwtConfig = {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
    },
};
//# sourceMappingURL=jwt.config.js.map