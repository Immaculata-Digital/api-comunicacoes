import { type JwtPayload } from 'jsonwebtoken';
export interface AuthTokenPayload extends JwtPayload {
    type: 'access';
    userId: string;
    login: string;
    email: string;
    permissions: string[];
}
export interface RefreshTokenPayload extends JwtPayload {
    type: 'refresh';
    userId: string;
}
export declare const generateAccessToken: (data: {
    userId: string;
    login: string;
    email: string;
    permissions: string[];
}) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const verifyAccessToken: (token: string) => AuthTokenPayload;
export declare const verifyRefreshToken: (token: string) => RefreshTokenPayload & {
    sub: string;
};
//# sourceMappingURL=jwt.d.ts.map