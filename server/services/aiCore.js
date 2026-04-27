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
                "To participate in Indian elections, you must meet these criteria:\n1. Be an Indian citizen of sound mind.\n2. Be at least 18 years old on the qualifying date.\n3. Be a resident of the constituency where you want to register.\n4. Not be disqualified under any law for voting.",
                "The basic requirements for voting in India are as follows:\n• You must be a citizen of India.\n• You must be 18 years or older on January 1st.\n• You must be an ordinary resident of the polling area.\n• You should not have any criminal or legal disqualifications.",
                "You are eligible to vote in Indian elections if you are:\n1. An Indian citizen residing in India.\n2. 18 years of age or older as of the qualifying date.\n3. A resident in the specific constituency for more than 6 months.\n4. Free from any legal disqualifications for voting."
            ]),
            quickReplies: ["I am 18+", "Under 18", "Not a citizen"]
        };
    }

    // 2. REGISTRATION / FORMS
    if (matches(['register', 'apply', 'form', 'enroll', 'new voter'])) {
        return {
            thought: "Registration intent detected. Directing to Form 6 / VSP portal.",
            response: getRandomResponse([
                "New voter registration is done via Form 6:\n1. Apply online through the Voters Service Portal or Helpline App.\n2. Upload proof of age, residence, and a recent photograph.\n3. Submit the form to your local Electoral Registration Office.\n4. Track your application status using the reference number provided.",
                "To enroll as a new voter, you need to follow these steps:\n• Fill out and submit Form 6 on the national VSP portal.\n• Keep your Aadhaar card and address proof ready for upload.\n• Ensure your photograph meets the specified digital requirements.\n• Your name will be added to the roll after due verification.",
                "Form 6 is the official form for new voter registration in India:\n1. Accessible via the Voter Helpline mobile application or portal.\n2. Requires basic personal details and supporting documents.\n3. Essential for all citizens who have turned 18 years old.\n4. Ensures your inclusion in the electoral roll for future voting."
            ]),
            quickReplies: ["Form 6 Guide", "Portal Link", "Offline Method"]
        };
    }

    // 3. IDENTIFICATION / DOCUMENTS
    if (matches(['document', 'proof', 'id card', 'epic', 'aadhaar', 'passport'])) {
        return {
            thought: "Document inquiry detected. Compiling list of accepted identity and address proofs.",
            response: getRandomResponse([
                "For voter registration, prepare these documents for upload:\n1. Age Proof: Aadhaar Card, PAN Card, or Birth Certificate.\n2. Address Proof: Passport, Utility Bill, or Bank Passbook.\n3. Photograph: A recent color passport-size photo.\n4. Ensure all files are in JPEG or PDF format for submission.",
                "To register as a voter, keep the following items ready:\n• Proof of Age: Aadhaar, PAN, or 10th Class Marksheet.\n• Proof of Residence: Electricity Bill, Passport, or Ration Card.\n• A recent passport-size photograph with a white background.\n• Scanned copies are required for the online application process.",
                "You will require these items for a successful voter application:\n1. Valid Age Proof showing your exact date of birth.\n2. Valid Address Proof showing your current residence address.\n3. A recent color photo for the Voter ID card (EPIC).\n4. All documents must be clearly legible and officially recognized."
            ]),
            quickReplies: ["Check Age Proofs", "Check Address Proofs"]
        };
    }

    // 4. CORRECTION / UPDATE
    if (matches(['correction', 'update', 'change', 'wrong', 'address change', 'name change'])) {
        return {
            thought: "Correction intent detected. Redirecting to Form 8.",
            response: getRandomResponse([
                "For corrections in your voter details, use Form 8:\n1. Use this for shifting residence or correcting data entries.\n2. Can be filed online via the VSP portal or the Helpline App.\n3. Supporting documents are required for the specific change.\n4. Use this form also for a replacement Voter ID card (EPIC).",
                "To update your details or correct errors, follow these steps:\n• Access Form 8 through the national Voters Service Portal.\n• Provide proof of change (e.g., certificate for name change).\n• Submit the request for shifting residence within constituency.\n• Track the correction status using your unique reference ID.",
                "Form 8 is used for shifting, correction, and EPIC replacement:\n1. Correct spelling errors in name, age, or address details.\n2. Update your photograph if the current one is outdated.\n3. Request a replacement card if your current one is damaged.\n4. Essential for maintaining an accurate electoral record."
            ]),
            quickReplies: ["Help with Form 8", "Voter ID Status"]
        };
    }

    // 5. GREETINGS
    if (matches(['hello', 'hi', 'hii', 'hey', 'helo', 'howdy', 'namaste', 'start', 'help'])) {
        return {
            thought: "Greeting detected. Responding in a warm, friendly tone.",
            response: getRandomResponse([
                "Hello! I am VoterAI, your assistant for Indian Elections:\n1. Help with New Voter Registration (Form 6).\n2. Assistance with Checking your Voting Eligibility.\n3. Guidance for Updating or Correcting Voter ID (Form 8).\n4. Information on finding your local Polling Station.",
                "Welcome! I am VoterAI, ready to assist with your electoral needs:\n• Guide you through the first-time registration process.\n• Explain the criteria for being an eligible voter in India.\n• Help you update your details on the electoral roll.\n• Provide info on essential forms like Form 6 and Form 8.",
                "Hi! Welcome to VoterAI. I am here to simplify voting for you:\n1. Assistance with Registering as a new voter via Form 6.\n2. Information on Updating details or changing address (Form 8).\n3. Details on Checking if you are eligible for the elections.\n4. Clear answers to your common voting-related questions."
            ]),
            quickReplies: ["Am I eligible?", "How to register?", "Update my info"]
        };
    }

    // DEFAULT FALLBACK (Dynamic Contextualization)
    return {
        thought: "No specific intent match. Generating contextualized clarifying response.",
        response: getRandomResponse([
            "I couldn't find a match for your query in my database:\n1. I am specialized specifically in Indian Electoral procedures.\n2. I can assist with registration, eligibility, and updates.\n3. Please ask about topics like Form 6, Form 8, or voter ID.\n4. My focus is entirely on helping you with voting information.",
            "I apologize, but my training is restricted to Indian voting:\n• I cannot provide info on topics outside of voter registration.\n• I assist with Form 6, Form 8, and electoral roll updates.\n• Please rephrase your query to focus on election-related items.\n• I am here to help every citizen exercise their right to vote.",
            "My neural core is limited to Indian Electoral assistance:\n1. I provide guidance on registration and procedural status.\n2. I am unable to answer questions on non-electoral topics.\n3. Please ask about Form 6, Form 8, or the VSP portal.\n4. How can I help you with your voter registration status today?"
        ]),
        quickReplies: ["Registration", "Eligibility", "ID Update"]
    };
};

module.exports = { processMessage };
