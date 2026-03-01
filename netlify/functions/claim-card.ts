import { Handler } from '@netlify/functions';
import axios from 'axios';

export const handler: Handler = async (event, context) => {
    // Handle GET - Fetch the live count of rows from the Make.com spreadsheet webhook
    if (event.httpMethod === 'GET') {
        try {
            const countWebhookUrl = process.env.BrainPuddleCheckCount;
            let remaining = 100;

            if (countWebhookUrl) {
                const response = await axios.get(countWebhookUrl);
                // Make.com should be configured to return JSON like { count: 3 }
                const currentCount = response.data?.count || 0;
                remaining = Math.max(0, 100 - currentCount);
            }

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ remaining, max: 100 })
            };
        } catch (error) {
            console.error("Failed to fetch count from Make.com", error);
            // Fallback gracefully so the UI doesn't crash
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ remaining: 100, max: 100 })
            };
        }
    }

    // Handle POST - claim a card
    if (event.httpMethod === 'POST') {
        try {
            const payload = JSON.parse(event.body || '{}');
            const { name, linkedinUrl, address, score, tier, pokemonName, imageUrl } = payload;

            if (!name || !linkedinUrl || !address) {
                return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
            }

            const webhookUrl = process.env.BrainPuddle;

            // If the user hasn't set up the webhook yet, we still return a success so the UI works
            // and we log it so they can see it in Netlify logs.
            if (!webhookUrl) {
                console.log('--- NEW CARD CLAIM RECEIVED (Setup Pending) ---');
                console.log(`Name: ${name}\nLinkedIn: ${linkedinUrl}\nAddress: ${address}\nScore: ${score}\nStage: ${pokemonName}\nImage URL: ${imageUrl}`);
                console.log('Please add BrainPuddle to your Netlify Environment Variables to send this to Google Sheets automatically.');

                return {
                    statusCode: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ success: true, count: "?", message: "Card claimed successfully! (Webhook setup pending)" })
                };
            }

            // Forward the payload to Make.com / Zapier or FormSubmit
            await axios.post(webhookUrl, {
                timestamp: new Date().toISOString(),
                name,
                linkedinUrl,
                address,
                score,
                tier,
                pokemonName,
                imageUrl
            });

            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ success: true, message: "Card claimed successfully and sent to Google Sheets!" })
            };

        } catch (error: any) {
            console.error("Webhook forwarding error:", error.message);
            return { statusCode: 500, body: JSON.stringify({ error: "Failed to process claim via webhook" }) };
        }
    }

    return { statusCode: 405, body: 'Method Not Allowed' };
};
