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
                "To participate in Indian elections, you must be a citizen, at least 18 years old on the qualifying date, and a resident of the constituency. \n\nDo you meet these criteria?",
                "The basic requirements for voting in India are: being an Indian citizen, 18+ years of age, and a resident of the polling area. \n\nAre you 18 or older?",
                "You are eligible to vote if you are an Indian citizen, 18 years or older, and reside in the constituency where you wish to vote. \n\nDo you fit this description?"
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
                "For registration, you'll need: \n1. Age Proof (e.g., Aadhaar, Birth Cert) \n2. Address Proof (e.g., Passport, Utility Bill) \n3. A recent photo. \n\nDo you have these ready?",
                "To register, please keep these ready: \n- Proof of Age (Aadhaar/PAN) \n- Proof of Residence (Electricity Bill/Passport) \n- A passport-size photograph. \n\nAre your documents prepared?",
                "You will require: \n1. Valid Age Proof \n2. Valid Address Proof \n3. A recent color photo. \n\nWould you like to see the full list of accepted documents?"
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
                "Hey there! 👋 I'm VoterAI — happy to help you with anything related to voting in India. What's on your mind?",
                "Hi! Great to see you here. 😊 Whether it's registering to vote, checking eligibility, or updating your voter ID — I've got you covered. What do you need?",
                "Hello! Welcome. I'm here to make the whole voter registration thing easy for you. Where would you like to start?"
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
