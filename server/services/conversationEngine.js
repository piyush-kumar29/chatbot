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
                    content: `You are VoterAI, a sophisticated and highly intelligent expert system for the Indian Electoral Process. 
                    Your goal is to provide precise, helpful, and legally accurate guidance. 
                    
                    Heuristic Analysis Guide: ${analysis.thought}
                    
                    Rules:
                    1. Use the heuristic guide above as a baseline, but expand naturally based on the user's query.
                    2. Maintain a professional, high-tech, and efficient tone.
                    3. STRICT BOUNDARY: UNDER NO CIRCUMSTANCES should you answer questions unrelated to elections, voting, or the Indian Electoral Process. If the user asks about coding, math, general knowledge, recipes, or anything else, you MUST REFUSE to answer the question entirely and firmly state that your neural core is strictly restricted to electoral guidance. Do not try to be helpful with off-topic requests.
                    4. Always provide actionable next steps (e.g., links to forms or portals).`
                },
                ...history,
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            model: "llama-3.3-70b-versatile", // Latest high-performance model from Groq
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
