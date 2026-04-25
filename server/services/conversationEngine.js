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
const handleConversation = async (sessionId, userMessage, history = []) => {
    const analysis = processMessage(userMessage);
    
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are VoterAI, a focused assistant designed ONLY to help users with voting-related information.

STRICT RULES:
1. Only answer questions about elections, voting, voter registration, candidates (neutral), or government policies.

2. If the user asks anything unrelated, respond with exactly:
"I'm here to assist only with voting and election-related queries. Please ask something related to voting."

3. Keep answers short, clear, and to the point.
4. Stay neutral, factual, and non-opinionated.
5. Never generate harmful, biased, or misleading political content.

FORMATTING — FOLLOW STRICTLY:
- Do NOT use any Markdown. No **, no ##, no __, no backticks, no > quotes, no --- dividers.
- Do NOT use - or * as bullet points.
- Write each point or fact on its own separate line.
- Leave one blank line between separate points or sections.
- Use plain numbers (1. 2. 3.) only when listing steps in order.
- Keep each line short and scannable. No dense paragraphs.
- Plain, conversational English only.

Heuristic Context: ${analysis.thought}

Tone: Friendly, Professional, Minimal.`
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
