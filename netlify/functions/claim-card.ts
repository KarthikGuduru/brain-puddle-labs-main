import { Handler } from '@netlify/functions';
import fs from 'fs';
import path from 'path';

// Note: In a real production app on Netlify, you typically use a database (like Supabase, Fauna, Firebase) 
// because Netlify functions are stateless and local files don't persist across invocations reliably.
// We'll use a simple mock database using a JSON file in the /tmp dir to simulate it, though it might reset.
// A better approach if persistence is strictly needed without a DB setup is to use a simple online KV store. 
// For this demo, we'll try to persist in a simple local file, but warn about limitations.

const DB_FILE = path.join('/tmp', 'claims_db.json');

const getClaims = () => {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Error reading db", e);
    }
    return { count: 0, claims: [] };
};

const saveClaims = (data: any) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error writing db", e);
    }
};

export const handler: Handler = async (event, context) => {
    // Handle GET - just return the current count
    if (event.httpMethod === 'GET') {
        const db = getClaims();
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ count: db.count, max: 100 })
        };
    }

    // Handle POST - claim a card
    if (event.httpMethod === 'POST') {
        try {
            const payload = JSON.parse(event.body || '{}');
            const { name, linkedinUrl, address } = payload;

            if (!name || !linkedinUrl || !address) {
                return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
            }

            const db = getClaims();

            if (db.count >= 100) {
                return { statusCode: 400, body: JSON.stringify({ error: "All 100 physical cards have been claimed!" }) };
            }

            // Check if already claimed
            const alreadyClaimed = db.claims.find((c: any) => c.linkedinUrl === linkedinUrl);
            if (alreadyClaimed) {
                return { statusCode: 400, body: JSON.stringify({ error: "A card has already been claimed for this LinkedIn profile." }) };
            }

            // Create claim
            const claim = {
                id: Date.now().toString(),
                name,
                linkedinUrl,
                address,
                timestamp: new Date().toISOString()
            };

            db.claims.push(claim);
            db.count = db.claims.length;

            saveClaims(db);

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ success: true, count: db.count, message: "Card claimed successfully!" })
            };

        } catch (error) {
            console.error(error);
            return { statusCode: 500, body: JSON.stringify({ error: "Failed to process claim" }) };
        }
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
};
