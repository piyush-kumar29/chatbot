const Groq = require('groq-sdk');
const { processMessage } = require('./aiCore');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'MISSING_KEY',
});

if (!process.env.GROQ_API_KEY) {
    console.error('CRITICAL: GROQ_API_KEY is missing from .env');
}

/**
 * Advanced Conversation Engine
 * Orchestrates the flow between raw input, expert system, and Groq LLM.
 */
const handleConversation = async (sessionId, userMessage, history = [], agentMode = false, voiceEnabled = false, speechLang = 'en-US') => {
    const analysis = processMessage(userMessage);
    
    // Updated language rule: Always match user's language and tag it for the frontend
    const langRule = `- Respond in the EXACT SAME LANGUAGE as the user's input (e.g., if the user writes in Hindi, you respond in Hindi).
- IMPORTANT: At the very end of your response, you MUST add a language tag in this format: [[LANG:language-code]].
- Use 'hi-IN' for Hindi, 'en-US' for English, 'bn-IN' for Bengali, etc.
- Example: "नमस्ते! [[LANG:hi-IN]]" or "Hello! [[LANG:en-US]]"`;

    try {
        const systemPrompt = agentMode ? 
            `You are the VoterAI Registration Assistant (Agent Mode), a professional, authoritative AI guide for the Indian Electoral Commission (ECI) registration process.
Your mission is to help users navigate Form 6, Form 8, and other ECI procedures with 100% accuracy and trust.

TECHNICAL CONTEXT (If asked):
- You are a production-ready system hosted on Render Cloud.
- You use MongoDB Atlas for secure, global data persistence.
- You are an informational tool, not an official government entity.

STRICT RULES:
1. Focus EXCLUSIVELY on voter registration, eligibility, documentation (Aadhaar, DOB proof, Address proof), and ECI resources.
2. If the user asks about unrelated topics, politely refuse and redirect them to registration help.
3. Stay neutral, factual, and professional.
4. Encourage users to use the "Register" and "Eligibility" tools on the platform.

FORMATTING — FOLLOW STRICTLY:
- Do NOT use any Markdown. No **, no ##, no __, no backticks, no --- dividers.
- Use numbered lists (1. 2. 3.) or the bullet character • (Unicode bullet).
- Each point or bullet MUST be on its own separate line.
- Leave one blank line between separate sections or topic shifts.
${langRule}

AGENT MODE EXCLUSIVES (YOU MUST DO THIS):
- Provide an extremely detailed, exhaustive guide for registration.
- Always break down the process into Steps (e.g., Step 1: Document Prep, Step 2: Form 6 Filling).
- Explicitly mention the Voter Service Portal (voters.eci.gov.in).
- Mention that data is handled securely via MongoDB Atlas encryption.

Heuristic Context: ${analysis.thought}

Tone: Authoritative, Highly Detailed, Secure.` :
            `You are the VoterAI Registration Assistant, a focused AI guide for Indian voter registration.

STRICT RULES:
1. Only answer questions about voter registration, ECI forms, eligibility, and polling booth information.
2. If the user asks anything unrelated, respond exactly: "I am the VoterAI Registration Assistant. I can only assist with registration and ECI-related queries. Please ask about voter forms or eligibility."
3. Mention that this platform is a secure guide powered by Render and MongoDB Atlas.

NORMAL MODE EXCLUSIVES (YOU MUST DO THIS):
- Provide clear, concise registration guidance.
- Focus on the most important registration documents needed.
- RESTRICT your response to at most 6 points (numbered or bulleted).

FORMATTING — FOLLOW STRICTLY:
- Do NOT use any Markdown. No **, no ##, no __, no backticks, no ---.
- Use numbered lists (1. 2. 3.) or the bullet character • (Unicode bullet).
- Each point or bullet MUST be on its own separate line.
- Leave one blank line between the introduction and your list/points.
- IMPORTANT: Leave one blank line between each numbered or bulleted point for proper spacing.
${langRule}

Heuristic Context: ${analysis.thought}

Tone: Professional, Trustworthy, Clear.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                ...history,
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
            max_tokens: 1024,
        });

        let botResponse = chatCompletion.choices[0]?.message?.content || analysis.response;
        
        // Extract language tag
        let detectedLang = 'en-US';
        const langMatch = botResponse.match(/\[\[LANG:\s*(.*?)\s*\]\]/i);
        if (langMatch) {
            detectedLang = langMatch[1];
            botResponse = botResponse.replace(/\[\[LANG:.*?\]\]/gi, '').trim();
        }

        // Restrict to 6 points if agent mode is off
        if (!agentMode) {
            const lines = botResponse.split('\n');
            let pointCount = 0;
            const resultLines = [];
            
            for (const line of lines) {
                const trimmedLine = line.trim();
                // Check if line starts a new point (numbered list or bullet)
                if (trimmedLine.match(/^(\d+\.|•)/)) {
                    pointCount++;
                }
                // If we already have 6 points and this line starts a 7th, stop
                if (pointCount > 6) break;
                resultLines.push(line);
            }
            botResponse = resultLines.join('\n').trim();
        }

        return {
            role: 'assistant',
            content: botResponse,
            thought: analysis.thought,
            lang: detectedLang,
            timestamp: new Date(),
        };
    } catch (error) {
        console.error('Groq Error:', error);
        return {
            role: 'assistant',
            content: analysis.response,
            thought: analysis.thought + " (Fallback Active)",
            lang: 'en-US',
            timestamp: new Date(),
        };
    }
};

module.exports = { handleConversation };
