"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const generateAccessToken = (data) => {
    const payload = {
        type: 'access',
        userId: data.userId,
        login: data.login,
        email: data.email,
        permissions: data.permissions,
        iat: Math.floor(Date.now() / 1000),
    };
    const options = {
        subject: data.userId,
        expiresIn: '15m',
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.security.jwtSecret, options);
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId) => {
    const payload = {
        type: 'refresh',
        userId,
        iat: Math.floor(Date.now() / 1000),
    };
    const options = {
        subject: userId,
        expiresIn: '7d',
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.security.jwtSecret, options);
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    const payload = jsonwebtoken_1.default.verify(token, env_1.env.security.jwtSecret);
    if (payload.type !== 'access') {
        throw new Error('Invalid token type');
    }
    if (!payload.sub || !payload.userId) {
        throw new Error('Invalid token payload');
    }
    return payload;
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    const payload = jsonwebtoken_1.default.verify(token, env_1.env.security.jwtSecret);
    if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
    }
    if (!payload.sub || !payload.userId) {
        throw new Error('Invalid token payload');
    }
    return payload;
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=jwt.js.map