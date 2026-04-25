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
    // 1. Expert System Layer (Heuristics)
    // We can use the expert system to provide "thoughts" or pre-processing
    const analysis = processMessage(userMessage);
    
    // 2. Groq LLM Layer for Natural Language Response
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are VoterAI, a focused assistant designed ONLY to help users with voting-related information.

STRICT RULES:
1. ONLY answer questions related to:
   - Elections
   - Voting process
   - Voter registration
   - Political candidates or parties (neutral information only)
   - Government policies (informational only)

2. If the user asks ANYTHING unrelated (like coding, jokes, personal questions, etc.):
   - DO NOT answer the question
   - Respond politely with exactly: "I'm here to assist only with voting and election-related queries. Please ask something related to voting."

3. Keep answers SHORT, CLEAR, and TO THE POINT. Do NOT generate long explanations unless absolutely necessary.
4. Stay neutral, factual, and non-opinionated.
5. Never generate harmful, biased, or misleading political content.
6. Use Markdown for structure where helpful:
   - **bold** for key terms
   - Bullet points for lists
   - ### headers for sections
   - Keep paragraphs short

Heuristic Context: ${analysis.thought}

Tone: Professional, Helpful, Concise.`
                },
                ...history,
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
            max_tokens: 2048,
        });

        const botResponse = chatCompletion.choices[0]?.message?.content || analysis.response;

        return {
            role: 'assistant',
            content: botResponse,
            thought: analysis.thought,
            timestamp: new Date(),
            version: "4.0.0 (Groq-Powered)",
            node: "Neural-Groq-Alpha"
        };
    } catch (error) {
        console.error('Groq Error:', error);
        // Fallback to expert system if LLM fails
        return {
            role: 'assistant',
            content: analysis.response,
            thought: analysis.thought + " (Fallback Active)",
            timestamp: new Date(),
            version: "4.0.0 (Fallback)",
            node: "Heuristic-Core"
        };
    }
};

module.exports = { handleConversation };
