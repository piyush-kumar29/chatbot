/**
 * AI Core - Expert System Layer
 * Advanced heuristic engine for Voter Assistance.
 */

const getRandomResponse = (responses) => responses[Math.floor(Math.random() * responses.length)];

const processMessage = (msg) => {
    const text = msg.toLowerCase();
    
    // Heuristic Matching Engine
    const matches = (keywords) => keywords.some(k => text.includes(k));

    // 1. ELIGIBILITY
    if (matches(['eligible', 'can i vote', 'age', '18', 'citizen'])) {
        return {
            thought: "Eligibility heuristic triggered. Checking statutory requirements (Age, Citizenship, Residency).",
            response: getRandomResponse([
                "To participate in Indian elections, you must meet these criteria:\n\n1. Be an Indian citizen\n2. Be at least 18 years old\n3. Be a resident of your constituency\n\nDo you meet these requirements?",
                "The basic requirements for voting in India are:\n\n- Indian citizenship\n- 18+ years of age\n- Resident of the polling area\n\nAre you 18 or older?",
                "You are eligible to vote if you are:\n\n1. An Indian citizen\n2. 18 years or older\n3. A resident in the constituency\n\nDo you fit this description?"
            ]),
            quickReplies: ["I am 18+", "Under 18", "Not a citizen"]
        };
    }

    // 2. REGISTRATION / FORMS
    if (matches(['register', 'apply', 'form', 'enroll', 'new voter'])) {
        return {
            thought: "Registration intent detected. Directing to Form 6 / VSP portal.",
            response: getRandomResponse([
                "New voter registration is done via Form 6. You can submit this online through the Voters' Service Portal or the Voter Helpline App. \n\nWould you like the step-by-step guide for Form 6?",
                "To enroll as a new voter, you'll need to fill out Form 6. This can be done digitally via the Voter Helpline App or VSP. \n\nDo you want me to guide you through the process?",
                "Form 6 is the official form for new voter registration. You can file it online on the Voters' Service Portal. \n\nShould I provide the direct link?"
            ]),
            quickReplies: ["Form 6 Guide", "Portal Link", "Offline Method"]
        };
    }

    // 3. IDENTIFICATION / DOCUMENTS
    if (matches(['document', 'proof', 'id card', 'epic', 'aadhaar', 'passport'])) {
        return {
            thought: "Document inquiry detected. Compiling list of accepted identity and address proofs.",
            response: getRandomResponse([
                "For registration, you'll need to keep these ready:\n\n1. Age Proof (e.g., Aadhaar, Birth Cert)\n2. Address Proof (e.g., Passport, Utility Bill)\n3. A recent photo\n\nDo you have these ready?",
                "To register, please prepare:\n\n- Proof of Age (Aadhaar/PAN)\n- Proof of Residence (Electricity Bill/Passport)\n- A passport-size photograph\n\nAre your documents prepared?",
                "You will require these items:\n\n1. Valid Age Proof\n2. Valid Address Proof\n3. A recent color photo\n\nWould you like to see the full list of accepted documents?"
            ]),
            quickReplies: ["Check Age Proofs", "Check Address Proofs"]
        };
    }

    // 4. CORRECTION / UPDATE
    if (matches(['correction', 'update', 'change', 'wrong', 'address change', 'name change'])) {
        return {
            thought: "Correction intent detected. Redirecting to Form 8.",
            response: getRandomResponse([
                "For corrections in your voter details or changing your address within the same constituency, you need to submit Form 8. \n\nWould you like assistance with Form 8?",
                "To update your address, name, or correct any errors on your Voter ID, you must file Form 8. \n\nShould I provide more details on Form 8?",
                "Form 8 is used for shifting of residence, correction of entries, and replacement of EPIC. \n\nDo you want the link to submit Form 8?"
            ]),
            quickReplies: ["Help with Form 8", "Voter ID Status"]
        };
    }

    // 5. GREETINGS
    if (matches(['hello', 'hi', 'hii', 'hey', 'helo', 'howdy', 'namaste', 'start', 'help'])) {
        return {
            thought: "Greeting detected. Responding in a warm, friendly tone.",
            response: getRandomResponse([
                "Hey there! 👋 I'm VoterAI.\n\nI can help you with:\n1. Voter Registration\n2. Checking Eligibility\n3. Updating Voter ID\n\nWhat's on your mind?",
                "Hi! Great to see you here. 😊\n\nI can guide you through:\n- Registering to vote\n- Checking your eligibility\n- Updating your details\n\nWhat do you need help with?",
                "Hello! Welcome. I'm here to make the voter registration process easy for you.\n\nWould you like to:\n1. Register as a new voter?\n2. Update existing details?\n3. Check if you're eligible?"
            ]),
            quickReplies: ["Am I eligible?", "How to register?", "Update my info"]
        };
    }

    // DEFAULT FALLBACK (Dynamic Contextualization)
    return {
        thought: "No specific intent match. Generating contextualized clarifying response.",
        response: getRandomResponse([
            "I couldn't find a direct match for your query in my electoral database. I am specialized specifically in **Indian Electoral procedures**. \n\nCould you please ask about registration, eligibility, or voter ID updates?",
            "I apologize, but I am only trained to assist with **voting and election-related matters**. \n\nIf you have questions about Form 6, Form 8, or your eligibility, I'd be happy to help!",
            "My neural core is restricted to **Indian Electoral assistance**. For other topics, I cannot provide accurate information. \n\nHow can I help you with your voter registration today?"
        ]),
        quickReplies: ["Registration", "Eligibility", "ID Update"]
    };
};

module.exports = { processMessage };
