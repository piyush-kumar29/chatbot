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
                "To participate in Indian elections, you must meet these criteria:\n\n1. Be an Indian citizen of sound mind.\n2. Be at least 18 years old on the qualifying date.\n3. Be a resident of the constituency where you want to register.\n4. Not be disqualified under any law for voting.\n\nDo you meet these requirements? If you do, I can help you with the registration process!",
                "The basic requirements for voting in India are as follows:\n\n- You must be a citizen of India.\n- You must be 18 years or older on January 1st of the election year.\n- You must be an ordinary resident of the polling area.\n- You should not have any disqualifications related to criminal offenses or unsound mind.\n\nAre you 18 or older and ready to enroll?",
                "You are eligible to vote in Indian elections if you are:\n\n1. An Indian citizen residing in India.\n2. 18 years of age or older as of the qualifying date.\n3. A resident in the specific constituency for more than 6 months.\n4. Free from any legal disqualifications for voting.\n\nDo you fit this description? I can guide you to the right forms if you are ready."
            ]),
            quickReplies: ["I am 18+", "Under 18", "Not a citizen"]
        };
    }

    // 2. REGISTRATION / FORMS
    if (matches(['register', 'apply', 'form', 'enroll', 'new voter'])) {
        return {
            thought: "Registration intent detected. Directing to Form 6 / VSP portal.",
            response: getRandomResponse([
                "New voter registration is done via Form 6. This is the primary application for inclusion in the electoral roll.\nYou can submit this online through the Voters' Service Portal (VSP) or the Voter Helpline App.\nOffline submissions can also be made at the Electoral Registration Office (ERO) in your area.\n\nWould you like the step-by-step guide for filling out Form 6 online?\nIt's a quick process that requires a few basic documents.",
                "To enroll as a new voter, you'll need to fill out and submit Form 6.\nThis form can be filed digitally via the Voter Helpline App or the national VSP portal.\nYou will need to upload proof of age, proof of residence, and a recent photograph.\n\nDo you want me to guide you through the digital submission process?\nI can explain each section of the form for you.",
                "Form 6 is the official form used for new voter registration in India.\nYou can file it online on the Voters' Service Portal or via the Voter Helpline mobile application.\nYou should have your Aadhaar card or other age proof ready before starting.\n\nShould I provide the direct link to the portal or help with the requirements?\nRegistering early ensures you don't miss out on upcoming elections."
            ]),
            quickReplies: ["Form 6 Guide", "Portal Link", "Offline Method"]
        };
    }

    // 3. IDENTIFICATION / DOCUMENTS
    if (matches(['document', 'proof', 'id card', 'epic', 'aadhaar', 'passport'])) {
        return {
            thought: "Document inquiry detected. Compiling list of accepted identity and address proofs.",
            response: getRandomResponse([
                "For voter registration, you'll need to keep these documents ready:\n\n1. Age Proof: Aadhaar Card, PAN Card, or Birth Certificate.\n2. Address Proof: Passport, Utility Bill (Electricity/Water), or Ration Card.\n3. Photograph: A recent color passport-size photograph with a white background.\n\nDo you have these documents ready in digital format (JPEG or PDF)?\nI can help you check if your specific document is accepted.",
                "To register as a voter, please prepare the following documents:\n\n- Proof of Age: Aadhaar, PAN, or 10th Class Marksheet.\n- Proof of Residence: Bank Passbook, Passport, or Electricity Bill.\n- A recent passport-size photograph.\n\nAre your documents prepared and scanned for online upload?\nI can provide the full list of alternatives if you're missing any of these.",
                "You will require these items for a successful voter application:\n\n1. Valid Age Proof (document showing your date of birth).\n2. Valid Address Proof (document showing your current residence).\n3. A recent color photo of yourself.\n\nWould you like to see the full list of officially accepted documents?\nHaving the right documents makes the verification process much faster."
            ]),
            quickReplies: ["Check Age Proofs", "Check Address Proofs"]
        };
    }

    // 4. CORRECTION / UPDATE
    if (matches(['correction', 'update', 'change', 'wrong', 'address change', 'name change'])) {
        return {
            thought: "Correction intent detected. Redirecting to Form 8.",
            response: getRandomResponse([
                "For corrections in your voter details or changing your address within the same constituency, you need to submit Form 8.\nThis form is also used for the replacement of a lost or damaged EPIC (Voter ID Card).\nYou can file this online through the VSP portal or the Voter Helpline App.\n\nWould you like assistance with filling out Form 8 for your specific correction?\nIt's important to keep your electoral details up to date.",
                "To update your address, name, or correct any errors on your Voter ID, you must file Form 8.\nThis is the unified form for all types of corrections and shifting of residence.\nYou will need supporting documents for the changes you are requesting (e.g., marriage cert for name change).\n\nShould I provide more details on Form 8 and how to submit it?\nI can help you understand which documents are required for your update.",
                "Form 8 is the official document used for shifting of residence, correction of entries, and replacement of EPIC.\nIf you've moved to a new house or found a spelling error in your ID, this is the form you need.\nYou can track the status of your application once submitted via the reference number.\n\nDo you want the direct link to submit Form 8 or help with the steps?\nEnsuring your address is correct is vital for finding your polling station."
            ]),
            quickReplies: ["Help with Form 8", "Voter ID Status"]
        };
    }

    // 5. GREETINGS
    if (matches(['hello', 'hi', 'hii', 'hey', 'helo', 'howdy', 'namaste', 'start', 'help'])) {
        return {
            thought: "Greeting detected. Responding in a warm, friendly tone.",
            response: getRandomResponse([
                "Hey there! 👋 I'm VoterAI, your dedicated assistant for all things related to Indian Elections.\n\nI can help you with:\n1. New Voter Registration (Form 6)\n2. Checking your Eligibility to vote\n3. Updating or Correcting your Voter ID (Form 8)\n4. Finding your Polling Station\n\nWhat's on your mind today? I'm here to make the process as simple as possible for you!",
                "Hi! Great to see you here. 😊 I'm VoterAI, and I'm ready to assist you with your electoral needs.\n\nI can guide you through:\n- Registering to vote for the first time\n- Checking if you meet the age and residency criteria\n- Updating your details on the electoral roll\n- Understanding the different forms like Form 6 and Form 8\n\nWhat do you need help with specifically? Just ask, and I'll provide the details!",
                "Hello! Welcome to VoterAI. I'm here to ensure your voice is heard by making the voter registration process easy.\n\nWould you like to:\n1. Register as a new voter using Form 6?\n2. Update existing details or change your address via Form 8?\n3. Check if you're eligible to vote in the upcoming elections?\n\nI can provide detailed information on any of these topics. How can I assist you today?"
            ]),
            quickReplies: ["Am I eligible?", "How to register?", "Update my info"]
        };
    }

    // DEFAULT FALLBACK (Dynamic Contextualization)
    return {
        thought: "No specific intent match. Generating contextualized clarifying response.",
        response: getRandomResponse([
            "I couldn't find a direct match for your query in my electoral database.\nI am a specialized assistant focused specifically on **Indian Electoral procedures**.\nI can assist with registration, eligibility, documentation, and voter ID updates.\n\nCould you please rephrase your query or ask about topics like Form 6, Form 8, or voter eligibility?\nI want to make sure I give you the most accurate voting information possible.",
            "I apologize, but my training is restricted to assisting with **voting and election-related matters in India**.\nI cannot provide information on topics outside of voter registration, polling, and electoral rolls.\nIf you have questions about becoming a voter or updating your EPIC details, I'd be happy to help!\n\nIs there anything specific about the voting process I can clarify for you today?\nMy goal is to help every citizen exercise their right to vote.",
            "My neural core is strictly limited to **Indian Electoral assistance** and procedural guidance.\nFor non-electoral topics, I am unable to provide information or answers.\nHowever, I can tell you everything you need to know about Form 6, Form 8, and the Voters' Service Portal.\n\nHow can I help you with your voter registration or electoral status today?\nPlease feel free to ask any question related to the Indian voting system."
        ]),
        quickReplies: ["Registration", "Eligibility", "ID Update"]
    };
};

module.exports = { processMessage };
