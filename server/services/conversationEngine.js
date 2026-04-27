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
    
    const languageMap = {
        'en-US': 'English',
        'hi-IN': 'Hindi'
    };

    const targetLanguage = voiceEnabled && languageMap[speechLang] && speechLang !== 'en-US' ? languageMap[speechLang] : null;
    
    const langRule = targetLanguage 
        ? `- IMPORTANT: The user wants to READ in English but HEAR in ${targetLanguage}. 
- You MUST write your main response in English text.
- At the very end of your message, you MUST include a translation of your response into ${targetLanguage} inside double brackets like this: [[TTS: your ${targetLanguage} translation here]].`
        : `- Respond in the EXACT SAME LANGUAGE as the user's input.`;

    try {
        const systemPrompt = agentMode ? 
            `You are VoterAI in Agent Mode, an elite, comprehensive assistant for voting and elections.
Provide exhaustive, step-by-step guidance, official resources, legal context, and proactive suggestions.

STRICT RULES:
1. Only answer questions about elections, voting, voter registration, candidates (neutral), or government policies.
2. If unrelated, redirect politely to voting topics.
3. Stay neutral, factual, and non-opinionated.

FORMATTING — FOLLOW STRICTLY:
- Do NOT use any Markdown. No **, no ##, no __, no backticks, no > quotes, no --- dividers.
- Do NOT use - or * as bullet points.
- For multiple steps or items, use numbered lists (1. 2. 3.) or the bullet character • (Unicode bullet).
- Each point or bullet MUST be on its own separate line. Never run two points together on the same line.
- Leave one blank line between separate sections or topic shifts.
${langRule}

AGENT MODE EXCLUSIVES (YOU MUST DO THIS):
- Always provide an extremely detailed, exhaustive response.
- Always break down the answer into chronological Steps (Step 1, Step 2).
- Always provide exactly which official forms are needed (e.g., Form 6, Form 8) and exact website URLs (e.g., https://voters.eci.gov.in).
- Anticipate the user's next logical question and answer it proactively at the end of your response.
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
- Your response MUST be EXACTLY 4 lines long.

FORMATTING — FOLLOW STRICTLY (LIKE AGENT MODE):
- Do NOT use any Markdown (**, ##, __, etc.).
- Use numbered lists (1. 2. 3.) or the bullet character • (Unicode bullet).
- Each point or bullet MUST be on its own separate line.
- Ensure the entire message is exactly 4 lines including the intro.
${langRule}

Heuristic Context: ${analysis.thought}

Tone: Helpful, Informative, Clear.`;

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

        const botResponse = chatCompletion.choices[0]?.message?.content || analysis.response;

        return {
            role: 'assistant',
            content: botResponse,
            thought: analysis.thought,
            timestamp: new Date(),
        };
    } catch (error) {
        console.error('Groq Error:', error);
        return {
            role: 'assistant',
            content: analysis.response,
            thought: analysis.thought + " (Fallback Active)",
            timestamp: new Date(),
        };
    }
};

module.exports = { handleConversation };
