import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs';
import pdfParse from 'pdf-parse';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

const BFL_API_KEY = process.env.VITE_BFL_API_KEY;

// Mock LLM Analysis logic (since we don't have an OpenAI key yet)
// In production, this would call OpenAI or Anthropic to extract details.
const generateAnalysis = (input) => {
    const isMockUrl = input.includes('linkedin.com/in/');

    let name = "Professional User";
    let isKarthik = input.toLowerCase().includes('karthik-guduru');

    if (isKarthik) {
        name = "Karthik Guduru";
    } else if (isMockUrl) {
        const parts = input.split('/');
        const unformattedName = parts[parts.length - 1] || parts[parts.length - 2] || "User";
        name = unformattedName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    if (isKarthik) {
        return {
            score: 12, // Very low replaceability
            tier: "🛡️ Irreplaceable",
            tierColor: "#00E676",
            categories: [
                { name: "Creative Strategy", score: 98, max: 100 },
                { name: "Technical Depth", score: 95, max: 100 },
                { name: "Human Empathy", score: 88, max: 100 },
            ],
            xp: 99,
            levelUpSuggestions: [
                "Automate reporting pipelines.",
                "Build empathetic client networks.",
                "Focus on high-level strategic architecture."
            ],
            pokemon: {
                name: "Karthik Guduru",
                title: "Founder & Creative Technologist",
                photoUrl: "",
                type: "Visionary",
                stage: "Master Level",
                hp: 250,
                skills: ["AI Architecture", "Creative Direction", "Systems Thinking", "Future Proofing"],
                stats: { cognitiveDepth: 95, decisionAutonomy: 80, adaptability: 90, systemLeverage: 100 },
                primaryDomain: "AI Solutions",
                operatingMode: "Architectural",
                humanLeverage: "High",
                powerUps: [
                    { name: "Brain Puddle Sync", desc: "Merges creative and technical domains instantly." },
                    { name: "Chaos Logic", desc: "Turns abstract chaos into structured cinematic intelligence." }
                ],
                pokedexEntry: `A rare visionary entity known to construct entire neural realities. Highly resistant to automation; in fact, it usually builds the automation. Feeds on complex design systems.`
            }
        };
    }

    return {
        score: Math.floor(Math.random() * 50) + 20, // 20-70 range
        tier: "⚔️ AI-Resistant",
        tierColor: "#ffeb3b",
        categories: [
            { name: "Creative Strategy", score: 80 + Math.floor(Math.random() * 20), max: 100 },
            { name: "Technical Depth", score: 50 + Math.floor(Math.random() * 40), max: 100 },
            { name: "Human Empathy", score: 70 + Math.floor(Math.random() * 30), max: 100 },
            { name: "Repetitive Tasks", score: 10 + Math.floor(Math.random() * 40), max: 100 },
        ],
        xp: 65,
        levelUpSuggestions: [
            "Leverage AI for boilerplate code generation.",
            "Strengthen cross-functional team leadership.",
            "Focus on complex system architecture."
        ],
        pokemon: {
            name: name,
            title: isMockUrl ? "Digital Architect" : "Strategic Consultant",
            photoUrl: "", // Will be filled by Flux
            type: "Creative",
            stage: "Basic Level",
            hp: 120 + Math.floor(Math.random() * 60),
            skills: ["Critical Thinking", "Adaptability", "Domain Expertise", "Client Relations"],
            stats: {
                cognitiveDepth: 60 + Math.floor(Math.random() * 40),
                decisionAutonomy: 50 + Math.floor(Math.random() * 40),
                adaptability: 70 + Math.floor(Math.random() * 30),
                systemLeverage: 80 + Math.floor(Math.random() * 20)
            },
            primaryDomain: "General Consulting",
            operatingMode: "Execution",
            humanLeverage: "Medium",
            powerUps: [
                { name: "Domain Knowledge", desc: "Instantly solves business logic edge cases." },
                { name: "Client Empathy", desc: "Deflects scope creep and restores project health." }
            ],
            pokedexEntry: `A highly adaptable entity. When threatened by automation, it instinctively creates a new framework. Known to survive entirely on oat milk lattes during launch weeks.`
        }
    };
};

app.post('/api/analyze', async (req, res) => {
    try {
        const { type, data } = req.body;
        // Backward compatibility for old "input" field
        const fallbackInput = req.body.input || data;

        let extractedText = "";

        if (type === 'pdf') {
            console.log("Analyzing uploaded PDF Document...");
            try {
                const buffer = Buffer.from(data, 'base64');
                const pdfData = await pdfParse(buffer);
                extractedText = pdfData.text.substring(0, 10000); // Prevent massive payloads
            } catch (err) {
                return res.status(400).json({ error: "Failed to parse PDF document." });
            }
        } else if (type === 'url') {
            // TODO: Relevance AI Integeration placeholder
            console.log("LinkedIn URL provided - falling back to basic prompt inference until Relevance API added.");
            extractedText = data; // use URL natively for now
        } else {
            console.log("Raw text/bio provided.");
            extractedText = data || fallbackInput;
        }

        // Log the input to a local file
        const logEntry = {
            timestamp: new Date().toISOString(),
            type,
            inputSnippet: extractedText.substring(0, 100) + "..."
        };
        const logFilePath = './uploads_log.json';

        fs.readFile(logFilePath, 'utf8', (err, logFile) => {
            let logs = [];
            if (!err && logFile) {
                try {
                    logs = JSON.parse(logFile);
                } catch (e) {
                    // Ignore parse errors, start fresh
                }
            }
            logs.push(logEntry);
            fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (err) => {
                if (err) console.error("Failed to save input log:", err);
            });
        });

        if (!process.env.OPENAI_API_KEY) {
            console.log("No OPENAI key found, returning mock data.");
            await new Promise(resolve => setTimeout(resolve, 1500));
            const analysis = generateAnalysis(extractedText);
            return res.json(analysis);
        }

        console.log(`Analyzing profile via OpenAI for input [${type}]`);

        const prompt = `You are an expert AI workforce analyst and gamification expert. The user has provided the following profile text, bio, or background context: \n\n"""\n${extractedText}\n"""\n 
Analyze their skills and determine how easily they could be replaced by AI. 
Provide a brutal but fun gamified report card in the style of a Pokémon card. 
Return ONLY a valid JSON object matching this exact structure:

{
  "score": <number 0-100, where lower means harder to replace, higher means easily replacable>,
  "tier": "<Emoji and Tier Name, e.g. ⚔️ AI-Resistant or ⚠️ Automatable>",
  "tierColor": "<Hex color representing the tier>",
  "categories": [
      { "name": "Creative Strategy", "score": <0-100>, "max": 100 },
      { "name": "Technical Depth", "score": <0-100>, "max": 100 },
      { "name": "Human Empathy", "score": <0-100>, "max": 100 },
      { "name": "Repetitive Tasks", "score": <0-100, higher means more repetitive>, "max": 100 }
  ],
  "xp": <number>,
  "levelUpSuggestions": [
      "<Suggestion 1: Short actionable sentence to reduce replaceability>",
      "<Suggestion 2: Short actionable sentence...>",
      "<Suggestion 3: Short actionable sentence...>"
  ],
  "pokemon": {
      "name": "<Extract their actual human Name from the profile/text. If none is found, use 'Unknown User' - DO NOT invent a moniker or use a job title. MAX 2 WORDS.>",
      "title": "<Catchy professional title, MAX 4 WORDS>",
      "photoUrl": "",
      "type": "<e.g., Creative, Engineering, Strategy, Visionary>",
      "stage": "<e.g., Basic Level, Master Level>",
      "hp": <number 100-300>,
      "skills": ["<Skill 1>", "<Skill 2>", "<Skill 3>", "<Skill 4>"],
      "stats": {
          "cognitiveDepth": <0-100>,
          "decisionAutonomy": <0-100>,
          "adaptability": <0-100>,
          "systemLeverage": <0-100>
      },
      "primaryDomain": "<e.g., AI Solutions, Generative Art, Finance>",
      "operatingMode": "<e.g., Architectural, Execution, Strategic>",
      "humanLeverage": "<High, Medium, or Low>",
      "powerUps": [
          { "name": "<Creative Power name>", "desc": "<Fun max 1 sentence description>" },
          { "name": "<Creative Power name 2>", "desc": "<Fun max 1 sentence description>" }
      ],
      "pokedexEntry": "<A 2-3 sentence fun description of their profile in the style of a rare collectible card, mentioning their defense against AI. DO NOT USE THE WORD POKÉMON OR POKEMON. Use terms like 'rare entity', 'anomaly', 'visionary', etc. IMPORTANT: USE STRICTLY GENDER-NEUTRAL PRONOUNS (they/them/their) OR REFER TO THEM BY NAME. DO NOT USE 'its', 'his', 'hers', or any gendered/objectifying terms.>"
  }
}

NOTE ON HALLUCINATIONS: It is highly likely the user is just providing a LinkedIn URL and you cannot scrape the page. If the input is just a URL without deep body text, DO NOT hallucinate heavily specific skills like "E-commerce solutions" or "Medical routing". Infer generic but highly professional traits based on the URL slug or job title (e.g. "Strategic Leadership", "Cross-functional Strategy", "Creative Vision"). Keep the stats and skills broadly applicable but punchy.`;

        const gptRes = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o",
            response_format: { type: "json_object" },
            messages: [{ role: "system", content: prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const analysis = JSON.parse(gptRes.data.choices[0].message.content);
        res.json(analysis);

    } catch (error) {
        console.error("Analysis error:", error?.response?.data || error.message);
        res.status(500).json({ error: "Failed to analyze profile via OpenAI" });
    }
});

// The Flux endpoint is asynchronous. It returns a Task ID.
// We must poll to get the actual image link.
app.post('/api/generate-card', async (req, res) => {
    const { name, title, type, analysis, imagePromptBase64 } = req.body;
    try {
        if (!BFL_API_KEY) {
            return res.status(500).json({ error: "BFL API key not configured." });
        }

        let prompt;
        const reqBody = {
            width: 768,
            height: 1024,
            prompt_upsampling: false,
            seed: Math.floor(Math.random() * 1000000),
            safety_tolerance: 2,
            output_format: "jpeg"
        };

        if (imagePromptBase64) {
            // User provided their own image - bypass BFL Flux generation entirely per request
            return res.json({ imageUrl: imagePromptBase64 });
        } else {
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            prompt = `Typography art, bold cool initials '${initials}'. Ensure the letters are scaled down to fit perfectly within frame with generous margins. Lots of negative space around the letters. Abstract background, Studio Ghibli inspired magical aesthetic. Futuristic floating letters in the center. Clean gradient background suitable for a trading card. Cinematic lighting, highly realistic 3D render.`;
            reqBody.prompt = prompt;
        }

        // 1. Submit task to Flux API
        const createResponse = await axios.post('https://api.bfl.ai/v1/flux-pro-1.1', reqBody, {
            headers: {
                'x-key': BFL_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const taskId = createResponse.data.id;
        const pollingUrl = createResponse.data.polling_url || `https://api.bfl.ai/v1/get_result?id=${taskId}`;

        // 2. Poll for completion
        let resultUrl = null;
        for (let i = 0; i < 20; i++) { // Poll 20 times (approx 40 seconds max)
            await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds

            const pollResponse = await axios.get(pollingUrl);

            if (pollResponse.data.status === 'Ready') {
                resultUrl = pollResponse.data.result.sample;
                break;
            } else if (pollResponse.data.status === 'Failed') {
                throw new Error("Flux API generation failed.");
            }
        }

        if (resultUrl) {
            // Fetch the image locally to bypass CORS when loaded dynamically in a canvas
            const imageBufferResponse = await axios.get(resultUrl, { responseType: 'arraybuffer' });
            const b64 = Buffer.from(imageBufferResponse.data, 'binary').toString('base64');
            res.json({ imageUrl: `data:image/jpeg;base64,${b64}` });
        } else {
            res.status(504).json({ error: "Image generation timed out." });
        }

    } catch (error) {
        console.error("Flux Error:", error?.response?.data || error.message);
        res.status(500).json({ error: "Failed to generate image" });
    }
});

// Endpoint to upload the card to Freeimage.host so it can be shared via URL on LinkedIn
app.post('/api/upload-image', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

        const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

        // Freeimage.host public API key (6d207e02198a847aa98d0a2a901485a5 works freely for anonymous uploads)
        const API_KEY = '6d207e02198a847aa98d0a2a901485a5';

        const formData = new URLSearchParams();
        formData.append('key', API_KEY);
        formData.append('action', 'upload');
        formData.append('source', base64Data);
        formData.append('format', 'json');

        const response = await axios.post('https://freeimage.host/api/1/upload', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (response.data && response.data.image && response.data.image.url) {
            res.json({ url: response.data.image.url });
        } else {
            throw new Error('Invalid response from image host');
        }

    } catch (error) {
        console.error("Image Upload Error:", error?.response?.data || error.message);
        res.status(500).json({ error: "Failed to upload image" });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
