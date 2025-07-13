import { MongoClient } from "mongodb";
import "dotenv/config";


const uri = process.env.DATABASE_URL!;
if (!uri) {
    throw new Error("DATABASE_URL manquant dans l'environnement");
}
const client = new MongoClient(uri);
const dbName = uri.split('/').pop() || 'test'; // à adapter si besoin

export async function insertTestPrintable(data: any) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("PrintableGame");
    await collection.insertOne(data);
}

export async function deleteTestPrintable(slug: string) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("PrintableGame");
    await collection.deleteMany({ slug });
}

export async function closeConnection() {
    await client.close();
}
