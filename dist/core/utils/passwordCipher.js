"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptPassword = exports.encryptPassword = exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = require("crypto");
const env_1 = require("../../config/env");
const SALT_ROUNDS = 10;
const ALGORITHM = 'aes-256-ctr';
const IV_LENGTH = 16;
const getKey = () => (0, crypto_1.createHash)('sha256').update(env_1.env.security.cryptoSecret).digest().subarray(0, 32);
// Funções de hash de senha usando bcrypt
const hashPassword = async (plainText) => {
    return await bcryptjs_1.default.hash(plainText, SALT_ROUNDS);
};
exports.hashPassword = hashPassword;
const comparePassword = async (plainText, storedPassword) => {
    // Verificar se é formato bcrypt (começa com $2)
    if (storedPassword.startsWith('$2')) {
        return await bcryptjs_1.default.compare(plainText, storedPassword);
    }
    // Se não for bcrypt, pode ser formato de criptografia (iv:encrypted)
    // Tentar descriptografar e comparar
    try {
        const decrypted = (0, exports.decryptPassword)(storedPassword);
        return decrypted === plainText;
    }
    catch {
        // Se não conseguir descriptografar, comparar diretamente (fallback)
        return storedPassword === plainText;
    }
};
exports.comparePassword = comparePassword;
// Funções de criptografia simétrica (para senhas SMTP que precisam ser descriptografadas)
const encryptPassword = (plainText) => {
    const iv = (0, crypto_1.randomBytes)(IV_LENGTH);
    const cipher = (0, crypto_1.createCipheriv)(ALGORITHM, getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};
exports.encryptPassword = encryptPassword;
const decryptPassword = (hash) => {
    const [ivHex, encryptedHex] = hash.split(':');
    if (!ivHex || !encryptedHex) {
        throw new Error('Invalid encrypted password format');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = (0, crypto_1.createDecipheriv)(ALGORITHM, getKey(), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString('utf8');
};
exports.decryptPassword = decryptPassword;
//# sourceMappingURL=passwordCipher.js.map