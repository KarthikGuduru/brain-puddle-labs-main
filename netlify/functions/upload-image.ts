import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    try {
        const body = JSON.parse(event.body || '{}');
        const { imageBase64 } = body;

        if (!imageBase64) {
            return { statusCode: 400, body: JSON.stringify({ error: 'No image provided' }) };
        }

        const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

        // Freeimage.host public API key (6d207e02198a847aa98d0a2a901485a5 works freely for anonymous uploads)
        const API_KEY = '6d207e02198a847aa98d0a2a901485a5';

        const formData = new URLSearchParams();
        formData.append('key', API_KEY);
        formData.append('action', 'upload');
        formData.append('source', base64Data);
        formData.append('format', 'json');

        const response = await fetch('https://freeimage.host/api/1/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.image && data.image.url) {
            return {
                statusCode: 200,
                body: JSON.stringify({ url: data.image.url })
            };
        } else {
            throw new Error('Invalid response from image host');
        }

    } catch (error: any) {
        console.error("Image Upload Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to upload image", details: error.message })
        };
    }
};
