// src/lib/prisma.ts
import 'server-only'
import { PrismaClient } from '@prisma/client'

// Utilise globalThis et rends la propriété optionnelle
const g = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
    g.prisma ??
    new PrismaClient({
        // Optionnel : des logs utiles en dev, silencieux en prod
        log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
        // datasourceUrl: process.env.DATABASE_URL, // <- tu peux décommenter si tu veux forcer l’URL
    })

// En dev, garde une instance unique (évite d’exploser le pool)
if (process.env.NODE_ENV !== 'production') g.prisma = prisma

export default prisma
