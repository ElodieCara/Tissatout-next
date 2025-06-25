import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encryptEmail, decryptEmail } from "@/lib/crypto";
import crypto from "crypto";

export async function GET() {
    try {
        const subscribers = await prisma.subscriber.findMany();
        console.log(`Traitement de ${subscribers.length} abonnés`);

        const formatted = subscribers.map((s) => {
            // Diagnostic détaillé pour identifier le problème
            console.log(`Traitement abonné ${s.id}:`, {
                hasEmailData: !!s.emailData,
                hasEmailIv: !!s.emailIv,
                emailDataType: typeof s.emailData,
                emailIvType: typeof s.emailIv,
                emailDataLength: s.emailData?.length,
                containsColon: s.emailData?.includes(":"),
                emailDataPreview: s.emailData?.substring(0, 50) + "..." // Aperçu sécurisé
            });

            // Vérifications plus strictes
            if (!s.emailData || typeof s.emailData !== 'string') {
                console.warn(`emailData manquant ou invalide pour ${s.id}`);
                return {
                    id: s.id,
                    email: "[DONNÉES MANQUANTES]",
                    status: s.status,
                    confirmedAt: s.confirmedAt,
                    error: "emailData manquant"
                };
            }

            if (!s.emailIv || typeof s.emailIv !== 'string') {
                console.warn(`emailIv manquant ou invalide pour ${s.id}`);
                return {
                    id: s.id,
                    email: "[IV MANQUANT]",
                    status: s.status,
                    confirmedAt: s.confirmedAt,
                    error: "emailIv manquant"
                };
            }

            if (!s.emailData.includes(":")) {
                console.warn(`Format emailData invalide pour ${s.id} - pas de séparateur ':'`);
                return {
                    id: s.id,
                    email: "[FORMAT INVALIDE]",
                    status: s.status,
                    confirmedAt: s.confirmedAt,
                    error: "Format de données invalide"
                };
            }

            // Vérification supplémentaire du format
            const parts = s.emailData.split(":");
            if (parts.length !== 2 || !parts[0] || !parts[1]) {
                console.warn(`Parties emailData invalides pour ${s.id}:`, parts);
                return {
                    id: s.id,
                    email: "[PARTIES MANQUANTES]",
                    status: s.status,
                    confirmedAt: s.confirmedAt,
                    error: "Données ou tag manquant"
                };
            }

            // Tentative de décryptage
            try {
                const decryptedEmail = decryptEmail(s.emailData, s.emailIv);
                console.log(`Décryptage réussi pour ${s.id}`);
                return {
                    id: s.id,
                    email: decryptedEmail,
                    status: s.status,
                    confirmedAt: s.confirmedAt,
                };
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
                const errorStack = error instanceof Error ? error.stack : undefined;

                console.error(`Erreur de décryption pour ${s.id}:`, {
                    error: errorMessage,
                    stack: errorStack,
                    emailDataLength: s.emailData.length,
                    emailIvLength: s.emailIv.length
                });
                return {
                    id: s.id,
                    email: "[ERREUR DÉCRYPTION]",
                    status: s.status,
                    confirmedAt: s.confirmedAt,
                    error: errorMessage
                };
            }
        });

        // Statistiques pour le diagnostic
        const stats = {
            total: formatted.length,
            successful: formatted.filter(f => !f.error).length,
            errors: formatted.filter(f => f.error).length
        };
        console.log('Statistiques de traitement:', stats);

        return NextResponse.json(formatted);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        console.error('Erreur globale dans GET /api/admin/subscribers:', error);
        return NextResponse.json({
            error: "Erreur serveur",
            details: errorMessage
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        // Validation de l'email
        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json({
                error: "Email invalide"
            }, { status: 400 });
        }

        // Génération des valeurs
        const { iv, data } = encryptEmail(email);
        const hash = crypto.createHash("sha256").update(email).digest("hex");
        const confirmationToken = crypto.randomBytes(32).toString("hex");

        // Vérification que le chiffrement a fonctionné
        if (!data || !data.includes(':')) {
            console.error('Erreur de chiffrement:', { data, iv });
            return NextResponse.json({
                error: "Erreur de chiffrement"
            }, { status: 500 });
        }

        console.log('Création nouvel abonné:', {
            email: email.substring(0, 3) + '***', // Email masqué pour les logs
            dataLength: data.length,
            ivLength: iv.length,
            hasColon: data.includes(':')
        });

        const newUser = await prisma.subscriber.create({
            data: {
                emailData: data,
                emailIv: iv,
                emailHash: hash,
                status: "pending",
                confirmationToken,
            },
        });

        // Test de décryptage immédiat pour vérifier
        try {
            const testDecrypt = decryptEmail(data, iv);
            console.log('Test de décryptage réussi pour le nouvel abonné');
        } catch (testError) {
            const testErrorMessage = testError instanceof Error ? testError.message : 'Erreur de test inconnue';
            console.error('Erreur lors du test de décryptage:', testErrorMessage);
        }

        return NextResponse.json({ id: newUser.id });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        console.error('Erreur dans POST /api/admin/subscribers:', error);
        return NextResponse.json({
            error: "Erreur serveur",
            details: errorMessage
        }, { status: 500 });
    }
}