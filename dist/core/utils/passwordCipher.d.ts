export declare const hashPassword: (plainText: string) => Promise<string>;
export declare const comparePassword: (plainText: string, storedPassword: string) => Promise<boolean>;
export declare const encryptPassword: (plainText: string) => string;
export declare const decryptPassword: (hash: string) => string;
//# sourceMappingURL=passwordCipher.d.ts.map