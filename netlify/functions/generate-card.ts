import { Handler } from '@netlify/functions';
import axios from 'axios';

export const handler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { name, title, type, analysis, imagePromptBase64 } = JSON.parse(event.body || '{}');
        const BFL_API_KEY = process.env.VITE_BFL_API_KEY || process.env.BFL_API_KEY;

        if (!BFL_API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "BFL API key not configured." })
            };
        }

        let prompt;
        const reqBody: any = {
            width: 768,
            height: 1024,
            prompt_upsampling: false,
            seed: Math.floor(Math.random() * 1000000),
            safety_tolerance: 2,
            output_format: "jpeg"
        };

        if (imagePromptBase64) {
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: imagePromptBase64 })
            };
        } else {
            const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
            prompt = `Typography art, bold cool initials '${initials}'. Abstract background, Studio Ghibli inspired magical aesthetic. Futuristic floating letters zoomed out with plenty of negative space around the letters. The initials must be fully visible and perfectly centered within the frame without being cut off at the edges. Clean gradient background suitable for a trading card. Cinematic lighting, highly realistic 3D render.`;
            reqBody.prompt = prompt;
        }

        const createResponse = await axios.post('https://api.bfl.ai/v1/flux-pro-1.1', reqBody, {
            headers: {
                'x-key': BFL_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const taskId = createResponse.data.id;
        const pollingUrl = createResponse.data.polling_url || `https://api.bfl.ai/v1/get_result?id=${taskId}`;

        let resultUrl = null;
        for (let i = 0; i < 20; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const pollResponse = await axios.get(pollingUrl);

            if (pollResponse.data.status === 'Ready') {
                resultUrl = pollResponse.data.result.sample;
                break;
            } else if (pollResponse.data.status === 'Failed') {
                throw new Error("Flux API generation failed.");
            }
        }

        if (resultUrl) {
            const imageBufferResponse = await axios.get(resultUrl, { responseType: 'arraybuffer' });
            const b64 = Buffer.from(imageBufferResponse.data, 'binary').toString('base64');
            return {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageUrl: `data:image/jpeg;base64,${b64}` })
            };
        } else {
            return {
                statusCode: 504,
                body: JSON.stringify({ error: "Image generation timed out." })
            };
        }

    } catch (error: any) {
        console.error("Flux Error:", error?.response?.data || error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to generate image" })
        };
    }
};
