import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function connectToDatabase() {
    try {
        await prisma.$connect();
        const url = process.env.DATABASE_URL || "URL not found in environment";
        console.log(`Connected to database at`)
        return url;
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        throw error;
    }
} 