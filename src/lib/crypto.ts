// src/lib/crypto.ts
import crypto from "crypto";

// Vérification de la clé de chiffrement
const KEY = process.env.ENCRYPTION_KEY;

// ⚠️ Logs de debug en dev uniquement
if (process.env.NODE_ENV !== "production") {
    console.log("Configuration crypto:", {
        hasKey: !!KEY,
        keyLength: KEY?.length,
        keyType: typeof KEY,
        keyPreview: KEY ? KEY.substring(0, 8) + "..." : "undefined",
    });
}

if (!KEY) {
    throw new Error("ENCRYPTION_KEY n'est pas définie dans les variables d'environnement");
}

const ENCRYPTION_KEY: string = KEY;

export function encryptEmail(email: string): { iv: string; data: string } {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY, "hex"), iv);

        let encrypted = cipher.update(email, "utf8", "hex");
        encrypted += cipher.final("hex");

        const authTag = cipher.getAuthTag();
        return {
            iv: iv.toString("hex"),
            data: `${encrypted}:${authTag.toString("hex")}`,
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        console.error("Erreur lors du chiffrement:", message);
        throw error;
    }
}

export function decryptEmail(encryptedEmail: string, iv: string): string {
    try {
        // Vérifs d'entrée
        if (!encryptedEmail || typeof encryptedEmail !== "string") {
            throw new Error("encryptedEmail doit être une chaîne non vide");
        }
        if (!iv || typeof iv !== "string") {
            throw new Error("iv doit être une chaîne non vide");
        }
        if (!ENCRYPTION_KEY) {
            throw new Error("ENCRYPTION_KEY n'est pas disponible");
        }
        if (!encryptedEmail.includes(":")) {
            throw new Error('Format de données chiffrées invalide - séparateur ":" manquant');
        }

        const [encryptedData, tagHex] = encryptedEmail.split(":");

        if (!encryptedData || !tagHex) {
            throw new Error("Format invalide - parties manquantes");
        }
        if (!/^[0-9a-fA-F]+$/.test(tagHex)) {
            throw new Error("Tag d'authentification invalide - doit être hexadécimal");
        }
        if (!/^[0-9a-fA-F]+$/.test(encryptedData)) {
            throw new Error("Données chiffrées invalides - doivent être hexadécimales");
        }
        if (!/^[0-9a-fA-F]+$/.test(iv)) {
            throw new Error("IV invalide - doit être hexadécimal");
        }

        const decipher = crypto.createDecipheriv(
            "aes-256-gcm",
            Buffer.from(ENCRYPTION_KEY, "hex"),
            Buffer.from(iv, "hex")
        );
        decipher.setAuthTag(Buffer.from(tagHex, "hex"));

        return (
            decipher.update(Buffer.from(encryptedData, "hex"), undefined, "utf8") +
            decipher.final("utf8")
        );
    } catch (error) {
        console.error("Erreur détaillée de décryptage:", {
            error: error instanceof Error ? error.message : "Erreur inconnue",
            stack: error instanceof Error ? error.stack : undefined, // ✅ pas de variable intermédiaire
            inputs: {
                encryptedEmailLength: encryptedEmail?.length,
                ivLength: iv?.length,
                hasKey: !!ENCRYPTION_KEY,
            },
        });
        throw error;
    }
}
