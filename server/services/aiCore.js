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
                "To participate in Indian elections, you must meet these criteria:\n\n1. Be an Indian citizen of sound mind.\n\n2. Be at least 18 years old on the qualifying date.\n\n3. Be a resident of the constituency where you want to register.",
                "The basic requirements for voting in India are as follows:\n\n• You must be a citizen of India.\n\n• You must be 18 years or older on January 1st.\n\n• You must be an ordinary resident of the polling area.",
                "You are eligible to vote in Indian elections if you are:\n\n1. An Indian citizen residing in India.\n\n2. 18 years of age or older as of the qualifying date.\n\n3. A resident in the specific constituency for more than 6 months."
            ]),
            quickReplies: ["I am 18+", "Under 18", "Not a citizen"]
        };
    }

    // 2. REGISTRATION / FORMS
    if (matches(['register', 'apply', 'form', 'enroll', 'new voter'])) {
        return {
            thought: "Registration intent detected. Directing to Form 6 / VSP portal.",
            response: getRandomResponse([
                "New voter registration is done via Form 6:\n\n1. Apply online through the Voters Service Portal or Helpline App.\n\n2. Upload proof of age, residence, and a recent photograph.\n\n3. Submit the form to your local Electoral Registration Office.",
                "To enroll as a new voter, you need to follow these steps:\n\n• Fill out and submit Form 6 on the national VSP portal.\n\n• Keep your Aadhaar card and address proof ready for upload.\n\n• Ensure your photograph meets the specified digital requirements.",
                "Form 6 is the official form for new voter registration in India:\n\n1. Accessible via the Voter Helpline mobile application or portal.\n\n2. Requires basic personal details and supporting documents.\n\n3. Essential for all citizens who have turned 18 years old."
            ]),
            quickReplies: ["Form 6 Guide", "Portal Link", "Offline Method"]
        };
    }

    // 3. IDENTIFICATION / DOCUMENTS
    if (matches(['document', 'proof', 'id card', 'epic', 'aadhaar', 'passport'])) {
        return {
            thought: "Document inquiry detected. Compiling list of accepted identity and address proofs.",
            response: getRandomResponse([
                "For voter registration, prepare these documents for upload:\n\n1. Age Proof: Aadhaar Card, PAN Card, or Birth Certificate.\n\n2. Address Proof: Passport, Utility Bill, or Bank Passbook.\n\n3. Photograph: A recent color passport-size photo.",
                "To register as a voter, keep the following items ready:\n\n• Proof of Age: Aadhaar, PAN, or 10th Class Marksheet.\n\n• Proof of Residence: Electricity Bill, Passport, or Ration Card.\n\n• A recent passport-size photograph with a white background.",
                "You will require these items for a successful voter application:\n\n1. Valid Age Proof showing your exact date of birth.\n\n2. Valid Address Proof showing your current residence address.\n\n3. A recent color photo for the Voter ID card (EPIC)."
            ]),
            quickReplies: ["Check Age Proofs", "Check Address Proofs"]
        };
    }

    // 4. CORRECTION / UPDATE
    if (matches(['correction', 'update', 'change', 'wrong', 'address change', 'name change'])) {
        return {
            thought: "Correction intent detected. Redirecting to Form 8.",
            response: getRandomResponse([
                "For corrections in your voter details, use Form 8:\n\n1. Use this for shifting residence or correcting data entries.\n\n2. Can be filed online via the VSP portal or the Helpline App.\n\n3. Supporting documents are required for the specific change.",
                "To update your details or correct errors, follow these steps:\n\n• Access Form 8 through the national Voters Service Portal.\n\n• Provide proof of change (e.g., certificate for name change).\n\n• Submit the request for shifting residence within constituency.",
                "Form 8 is used for shifting, correction, and EPIC replacement:\n\n1. Correct spelling errors in name, age, or address details.\n\n2. Update your photograph if the current one is outdated.\n\n3. Request a replacement card if your current one is damaged."
            ]),
            quickReplies: ["Help with Form 8", "Voter ID Status"]
        };
    }

    // 5. GREETINGS
    if (matches(['hello', 'hi', 'hii', 'hey', 'helo', 'howdy', 'namaste', 'start', 'help'])) {
        return {
            thought: "Greeting detected. Responding in a warm, friendly tone.",
            response: getRandomResponse([
                "Hello! I am VoterAI, your assistant for Indian Elections:\n\n1. Help with New Voter Registration (Form 6).\n\n2. Assistance with Checking your Voting Eligibility.\n\n3. Guidance for Updating or Correcting Voter ID (Form 8).",
                "Welcome! I am VoterAI, ready to assist with your electoral needs:\n\n• Guide you through the first-time registration process.\n\n• Explain the criteria for being an eligible voter in India.\n\n• Help you update your details on the electoral roll.",
                "Hi! Welcome to VoterAI. I am here to simplify voting for you:\n\n1. Assistance with Registering as a new voter via Form 6.\n\n2. Information on Updating details or changing address (Form 8).\n\n3. Details on Checking if you are eligible for the elections."
            ]),
            quickReplies: ["Am I eligible?", "How to register?", "Update my info"]
        };
    }

    // DEFAULT FALLBACK (Dynamic Contextualization)
    return {
        thought: "No specific intent match. Generating contextualized clarifying response.",
        response: getRandomResponse([
            "I couldn't find a match for your query in my database:\n\n1. I am specialized specifically in Indian Electoral procedures.\n\n2. I can assist with registration, eligibility, and updates.\n\n3. Please ask about topics like Form 6, Form 8, or voter ID.",
            "I apologize, but my training is restricted to Indian voting:\n\n• I cannot provide info on topics outside of voter registration.\n\n• I assist with Form 6, Form 8, and electoral roll updates.\n\n• Please rephrase your query to focus on election-related items.",
            "My neural core is limited to Indian Electoral assistance:\n\n1. I provide guidance on registration and procedural status.\n\n2. I am unable to answer questions on non-electoral topics.\n\n3. Please ask about Form 6, Form 8, or the VSP portal."
        ]),
        quickReplies: ["Registration", "Eligibility", "ID Update"]
    };
};

module.exports = { processMessage };
