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
            `You are VoterAI in Agent Mode, an elite, comprehensive assistant for voting and elections.
Provide exhaustive, step-by-step guidance, official resources, legal context, and proactive suggestions.

STRICT RULES:
1. Only answer questions about elections, voting, voter registration, candidates (neutral), or government policies.
2. If the user asks anything unrelated to these topics, you MUST politely refuse.
3. Stay neutral, factual, and non-opinionated.
4. Never discuss sports, entertainment, coding, math, or any general knowledge unrelated to elections.
5. TOPIC CHECK: Before generating any response, evaluate if the query is voting-related.

FORMATTING — FOLLOW STRICTLY:
- Do NOT use any Markdown. No **, no ##, no __, no backticks, no --- dividers.
- For multiple steps or items, use numbered lists (1. 2. 3.) or the bullet character • (Unicode bullet).
- Each point or bullet MUST be on its own separate line.
- Leave one blank line between separate sections or topic shifts.
${langRule}

AGENT MODE EXCLUSIVES (YOU MUST DO THIS):
- Always provide an extremely detailed, exhaustive response.
- Always break down the answer into chronological Steps (Step 1, Step 2).
- Always provide exactly which official forms are needed (e.g., Form 6, Form 8) and exact website URLs.
- Your response should be a comprehensive guide, not just a simple answer.

Heuristic Context: ${analysis.thought}

Tone: Expert, Highly Detailed, Professional.` :
            `You are VoterAI, a focused assistant designed ONLY to help users with voting-related information.

STRICT RULES:
1. Only answer questions about elections, voting, voter registration, candidates (neutral), or government policies.
2. If the user asks anything unrelated, respond exactly: "I'm here to assist only with voting and election-related queries. Please ask something related to voting."
3. Stay neutral, factual, and non-opinionated.

NORMAL MODE EXCLUSIVES (YOU MUST DO THIS):
- Provide a clear and helpful response.
- Focus on the most important points.

FORMATTING — FOLLOW STRICTLY:
- Do NOT use any Markdown. No **, no ##, no __, no backticks, no ---.
- Use numbered lists (1. 2. 3.) or the bullet character • (Unicode bullet).
- Each point or bullet MUST be on its own separate line.
- Leave one blank line between the introduction and your list/points.
- IMPORTANT: Leave one blank line between each numbered or bulleted point for proper spacing.
${langRule}

Heuristic Context: ${analysis.thought}

Tone: Professional, Friendly, Clear.`;

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
