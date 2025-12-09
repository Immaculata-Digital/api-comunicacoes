"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 10;
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
    // Se não for bcrypt, comparar diretamente (fallback)
    return storedPassword === plainText;
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=passwordCipher.js.map