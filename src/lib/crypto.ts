// src/lib/crypto.ts
import crypto from 'crypto';

// Vérification de la clé de chiffrement
const KEY = process.env.ENCRYPTION_KEY;

// Debug de la clé
console.log('Configuration crypto:', {
    hasKey: !!KEY,
    keyLength: KEY?.length,
    keyType: typeof KEY,
    keyPreview: KEY ? KEY.substring(0, 8) + '...' : 'undefined'
});

if (!KEY) {
    throw new Error('ENCRYPTION_KEY n\'est pas définie dans les variables d\'environnement');
}

// Assertion TypeScript pour indiquer que KEY est défini après la vérification
const ENCRYPTION_KEY: string = KEY;

export function encryptEmail(email: string): { iv: string; data: string } {
    try {
        console.log('Chiffrement email:', { emailLength: email.length });

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY, "hex"), iv);

        let encrypted = cipher.update(email, "utf8", "hex");
        encrypted += cipher.final("hex");

        const authTag = cipher.getAuthTag();
        const result = {
            iv: iv.toString("hex"),
            data: encrypted + ":" + authTag.toString("hex")
        };

        console.log('Résultat chiffrement:', {
            ivLength: result.iv.length,
            dataLength: result.data.length,
            hasColon: result.data.includes(':')
        });

        return result;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        console.error('Erreur lors du chiffrement:', message);
        throw error;
    }

}

export function decryptEmail(encryptedEmail: string, iv: string): string {
    try {
        console.log('Tentative de décryptage:', {
            encryptedEmailLength: encryptedEmail.length,
            ivLength: iv.length,
            hasKey: !!ENCRYPTION_KEY,
            keyLength: ENCRYPTION_KEY?.length
        });

        // Vérifications préliminaires
        if (!encryptedEmail || typeof encryptedEmail !== 'string') {
            throw new Error('encryptedEmail doit être une chaîne non vide');
        }

        if (!iv || typeof iv !== 'string') {
            throw new Error('iv doit être une chaîne non vide');
        }

        if (!ENCRYPTION_KEY) {
            throw new Error('ENCRYPTION_KEY n\'est pas disponible');
        }

        // Vérification du format
        if (!encryptedEmail.includes(':')) {
            throw new Error('Format de données chiffrées invalide - séparateur ":" manquant');
        }

        const [encryptedData, tagHex] = encryptedEmail.split(":");

        console.log('Données extraites:', {
            encryptedDataLength: encryptedData?.length,
            tagHexLength: tagHex?.length,
            encryptedDataType: typeof encryptedData,
            tagHexType: typeof tagHex
        });

        // Vérifications des parties
        if (!encryptedData || !tagHex) {
            throw new Error(`Format invalide - encryptedData: ${!!encryptedData}, tagHex: ${!!tagHex}`);
        }

        // Vérification format hexadécimal
        if (!/^[0-9a-fA-F]+$/.test(tagHex)) {
            throw new Error('Tag d\'authentification invalide - doit être hexadécimal');
        }

        if (!/^[0-9a-fA-F]+$/.test(encryptedData)) {
            throw new Error('Données chiffrées invalides - doivent être hexadécimales');
        }

        if (!/^[0-9a-fA-F]+$/.test(iv)) {
            throw new Error('IV invalide - doit être hexadécimal');
        }

        console.log('Avant création du decipher...');

        // Création du decipher
        const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY, "hex"), Buffer.from(iv, "hex"));

        console.log('Decipher créé, ajout du tag...');
        decipher.setAuthTag(Buffer.from(tagHex, "hex"));

        console.log('Tag ajouté, décryptage...');
        const decrypted = decipher.update(Buffer.from(encryptedData, "hex"), undefined, "utf8") + decipher.final("utf8");

        console.log('Décryptage réussi:', { resultLength: decrypted.length });
        return decrypted;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        const errorStack = error instanceof Error ? error.stack : undefined;
        console.error('Erreur détaillée de décryptage:', {
            error: errorMessage,
            stack: errorStack,
            inputs: {
                encryptedEmailLength: encryptedEmail?.length,
                ivLength: iv?.length,
                hasKey: !!ENCRYPTION_KEY
            }
        });
        throw error;
    }
}