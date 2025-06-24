import { jwtVerify } from "jose";

export async function verifyAdminToken(token: string) {
    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY!));
        return true;
    } catch {
        return false;
    }
}
