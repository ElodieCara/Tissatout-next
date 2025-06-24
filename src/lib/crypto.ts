import crypto from "crypto";

const KEY = process.env.ENCRYPTION_KEY!;
const IV_LENGTH = 16;

export function encryptEmail(email: string): { iv: string; data: string } {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(KEY, "hex"), iv);
    const encrypted = Buffer.concat([cipher.update(email, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return {
        iv: iv.toString("hex"),
        data: `${encrypted.toString("hex")}:${tag.toString("hex")}`
    };
}

export function decryptEmail(iv: string, dataWithTag: string): string {
    const [encryptedData, tagHex] = dataWithTag.split(":");
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(KEY, "hex"), Buffer.from(iv, "hex"));
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    return decipher.update(Buffer.from(encryptedData, "hex"), undefined, "utf8") + decipher.final("utf8");
}
