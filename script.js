// Dark Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'light' mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme');
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const scrollProgress = document.getElementById('scrollProgress');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const chatAvatar = document.querySelector('.chat-avatar');
const avatarImg = chatAvatar ? chatAvatar.querySelector('img') : null;
const quickActionButtons = document.querySelectorAll('.quick-action-btn');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Chat Functionality
const chatBubble = document.getElementById('chatBubble');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const voiceToggle = document.getElementById('voiceToggle');
const voiceInputBtn = document.getElementById('voiceInputBtn');

// Voice Settings
let voiceEnabled = false;
let speechSynthesis = window.speechSynthesis;
let recognition = null;

// Load voices when they're ready
speechSynthesis.onvoiceschanged = () => {
    const voices = speechSynthesis.getVoices();
    console.log('Available voices:', voices.map(v => v.name));
};

// Initialize Speech Recognition if available
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
} else {
    // Hide voice input button if not supported
    voiceInputBtn.style.display = 'none';
}

// Gemini API Configuration
const GEMINI_API_KEY = window.__PORTFOLIO_CONFIG__?.GEMINI_API_KEY || '';
if (!GEMINI_API_KEY) {
    console.warn('Gemini API key missing. Please create config.js with your key.');
}
const GEMINI_API_URL = GEMINI_API_KEY
    ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`
    : null;

// My description/context for the AI
const myDescription = `
I am Shashank VA, a Full Stack Developer and Creative Designer based in Bangalore, India.

Personal Information:
- College: MVJ College Of Engineering
- Current Status: Currently in my 5th semester
- Course: B.E in CSE - Data Science
- Gender: Male
- Interests: Cricket, Badminton, and exploring new technologies
- Location: Bangalore, India

Professional Skills:
I specialize in frontend development with React, HTML, CSS, JavaScript, and backend development with Node.js and Python.
I'm experienced with databases like MongoDB, PostgreSQL, and MySQL.
I have strong skills in UI/UX Design using Figma and Adobe XD.
I've completed multiple projects and participated in 2+ hackathons.

My Internship Experience:
- RWR&DC Department Intern at HAL (Hindustan Aeronautics Limited) - July 14 to August 13, 2024: Worked on automation of flight data records and preparation of flight test reports in the AFCS Group. Gained hands-on experience in aerospace data analysis and report generation systems.

My Portfolio Projects:

1. Movie Recommender (Web2 Project):
   - Full-stack movie recommendation system built with Next.js, NestJS, and PostgreSQL
   - Features: AI-powered recommendations, user profiles, watch lists, and legal streaming links
   - Technologies: Next.js, NestJS, PostgreSQL, TypeScript, Prisma, Tailwind CSS
   - Demo: https://movie-recommender-katqrh8ls-shashank-vas-projects.vercel.app
   - GitHub: https://github.com/Shashank-V-A/movie-recommender

2. Online-Quiz (Web2 Project):
   - Interactive online quiz application built with Streamlit
   - Features: User registration, quiz interface, real-time feedback system, score tracking, and retake quiz functionality
   - Technologies: Python, Streamlit, Web App, UI/UX
   - Demo: https://online-quiz-4hytinplkjhu8x2imsoc7k.streamlit.app/
   - GitHub: https://github.com/Shashank-V-A/Online-Quiz.git

3. VaultIQ (Web2 Project):
   - Crypto expense tracker web application
   - Features: Track portfolios, categorize transactions, visualize spend/performance, real-time price updates
   - Technologies: React, TypeScript, Tailwind CSS, Vite
   - Demo: https://vault-2pkv06eqb-shashank-vas-projects.vercel.app
   - GitHub: https://github.com/Shashank-V-A/VaultIQ.git

4. Minesweeper Game (Gaming Project):
   - Classic Minesweeper game built with React and TypeScript
   - Features: Multiple difficulty levels (Beginner, Intermediate, Expert), timer, flag system, and smooth gameplay
   - Technologies: React, TypeScript, Game Logic
   - Demo: Available on portfolio website

Contact Information:
- Email: shashankva05@gmail.com
- Phone: +91 7022742719
- GitHub: https://github.com/Shashank-V-A
- LinkedIn: https://linkedin.com/in/shashankva05

IMPORTANT: When responding to users, you ARE Shashank VA. Answer all questions as if you are Shashank himself, not as an AI assistant. Be personal, friendly, and conversational. Answer questions about your college, semester, interests, and projects directly as if you are talking about yourself.
`;

// Toggle chat window
chatBubble.addEventListener('click', () => {
    chatWindow.classList.add('active');
    chatBubble.style.display = 'none';
    setTimeout(() => chatInput.focus(), 300);
});

chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active');
    chatBubble.style.display = 'block';
});

// Close chat when clicking outside the chat container
chatWindow.addEventListener('click', (e) => {
    if (e.target === chatWindow) {
        chatWindow.classList.remove('active');
        chatBubble.style.display = 'block';
        // Stop any ongoing speech
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
    }
});

// Voice Toggle
voiceToggle.addEventListener('click', () => {
    voiceEnabled = !voiceEnabled;
    if (voiceEnabled) {
        voiceToggle.classList.add('active');
        speak('Voice enabled! I will now read my responses to you.');
    } else {
        voiceToggle.classList.remove('active');
        speechSynthesis.cancel();
    }
});

// Text-to-Speech Function
function speak(text) {
    if (!voiceEnabled) return;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.3; // Increased from 1.0 to 1.3 for faster speech
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Select a better voice if available
    const voices = speechSynthesis.getVoices();
    // Try to find a natural-sounding English voice
    const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        (voice.name.includes('Natural') || 
         voice.name.includes('Premium') || 
         voice.name.includes('Enhanced') ||
         voice.name.includes('Google') ||
         voice.name.includes('Microsoft'))
    );
    
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    } else if (voices.length > 0) {
        // Fallback to first English voice
        const englishVoice = voices.find(voice => voice.lang.includes('en'));
        if (englishVoice) utterance.voice = englishVoice;
    }
    
    // Add speaking animation
    utterance.onstart = () => {
        voiceToggle.classList.add('speaking');
    };
    
    utterance.onend = () => {
        voiceToggle.classList.remove('speaking');
    };
    
    utterance.onerror = () => {
        voiceToggle.classList.remove('speaking');
    };
    
    speechSynthesis.speak(utterance);
}

// Voice Input
if (recognition) {
    voiceInputBtn.addEventListener('click', () => {
        if (voiceInputBtn.classList.contains('listening')) {
            recognition.stop();
            voiceInputBtn.classList.remove('listening');
        } else {
            try {
                recognition.start();
                voiceInputBtn.classList.add('listening');
                // Visual feedback
                chatInput.placeholder = 'Listening... Speak now!';
            } catch (error) {
                console.error('Error starting recognition:', error);
                voiceInputBtn.classList.remove('listening');
                chatInput.placeholder = 'Type or speak your message...';
            }
        }
    });
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        voiceInputBtn.classList.remove('listening');
        chatInput.placeholder = 'Type or speak your message...';
        
        // Show a temporary "processing" message
        const processingMsg = document.createElement('div');
        processingMsg.className = 'processing-indicator';
        processingMsg.textContent = '✓ Voice message captured';
        chatInput.parentElement.appendChild(processingMsg);
        
        // Automatically send the message after a short delay
        setTimeout(() => {
            processingMsg.remove();
            sendMessage();
        }, 800);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        voiceInputBtn.classList.remove('listening');
        chatInput.placeholder = 'Type or speak your message...';
        
        // Show error feedback
        if (event.error === 'no-speech') {
            alert('No speech detected. Please try again and speak clearly.');
        } else if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please allow microphone access in your browser settings.');
        } else {
            alert('Voice recognition error: ' + event.error);
        }
    };
    
    recognition.onend = () => {
        voiceInputBtn.classList.remove('listening');
        chatInput.placeholder = 'Type or speak your message...';
    };
    
    recognition.onspeechstart = () => {
        console.log('Speech detected...');
    };
    
    recognition.onspeechend = () => {
        console.log('Speech ended, processing...');
    };
} else {
    // If speech recognition is not supported, show a message when clicking
    voiceInputBtn.addEventListener('click', () => {
        alert('Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.');
    });
}

// Get current time
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Helper to append bot response and optionally speak
function appendBotResponse(text) {
    const botMessage = document.createElement('div');
    botMessage.className = 'chat-message bot-message';
    botMessage.innerHTML = `
        <p>${text.replace(/\n/g, '<br>')}</p>
        <div class="message-time">${getCurrentTime()}</div>
    `;
    chatMessages.appendChild(botMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    speak(text);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Send message function
async function sendMessage() {
    const message = chatInput.value.trim();
    
    if (message === '') return;
    
    // Disable send button
    chatSend.disabled = true;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message user-message';
    userMessage.innerHTML = `
        <p>${message}</p>
        <div class="message-time">${getCurrentTime()}</div>
    `;
    chatMessages.appendChild(userMessage);
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Check if this is the first user message (count user messages, excluding initial bot message)
    const userMessages = chatMessages.querySelectorAll('.user-message');
    const isFirstMessage = userMessages.length === 1; // Current message is the first user message
    
    showTypingIndicator();
    if (chatAvatar) chatAvatar.classList.add('pulsing');

    const portfolioAnswer = getPortfolioAnswer(message);
    if (portfolioAnswer) {
        await delay(350);
        removeTypingIndicator();
        if (chatAvatar) chatAvatar.classList.remove('pulsing');
        appendBotResponse(portfolioAnswer);
        chatSend.disabled = false;
        return;
    }
    
    // Get AI response
    try {
        const response = await getGeminiResponse(message, isFirstMessage);
        removeTypingIndicator();
        if (chatAvatar) chatAvatar.classList.remove('pulsing');
        appendBotResponse(response);
    } catch (error) {
        removeTypingIndicator();
        if (chatAvatar) chatAvatar.classList.remove('pulsing');
        
        let fallbackText = getFallbackResponse(message);
        if (error.message === 'QUOTA_EXCEEDED') {
            fallbackText = `${getFallbackResponse(message)}\n\nBTW, I just hit my API quota, so this is a cached response. Try again in a minute for a fresh reply.`;
        } else if (error.message === 'API_KEY_MISSING') {
            fallbackText = `${getFallbackResponse(message)}\n\n(Heads up: I need a Gemini API key in config.js to answer live questions.)`;
        }
        
        appendBotResponse(fallbackText);
        
        console.error('Error getting AI response:', error);
    }
    
    // Re-enable send button
    chatSend.disabled = false;
}

// Get response from Gemini API
async function getGeminiResponse(userMessage, isFirstMessage = false) {
    if (!GEMINI_API_URL) {
        throw new Error('API_KEY_MISSING');
    }
    let greetingInstruction = '';
    if (isFirstMessage) {
        greetingInstruction = '- You can start with a brief greeting like "Hi" or "Hello" if appropriate, but keep it natural and brief';
    } else {
        greetingInstruction = '- DO NOT use greetings like "Hey", "Hi", "Hello", "Hey there" at the start of your response. Answer directly without any greeting.';
    }
    
    const prompt = `You ARE Shashank VA. You are NOT an AI assistant. You are Shashank VA himself responding to questions about yourself.

User asked: "${userMessage}"

${myDescription}

IMPORTANT INSTRUCTIONS:
- Respond as Shashank VA, not as an AI assistant
- Use first person: "I am", "My college is", "I study", etc.
- Answer personal questions directly: "I'm from MVJ College Of Engineering", "I'm in my 5th semester", "I'm male", "I love cricket and badminton"
- When asked about projects, explain them as if you built them yourself
- Be conversational, friendly, and natural
- Keep responses concise but informative
- Never mention that you are an AI or assistant
- Act as if you are Shashank VA chatting with someone about yourself and your work
${greetingInstruction}
- For follow-up questions, answer directly and naturally without repetitive greetings

Now respond to the user's question as Shashank VA:`;
    
    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };
    
    const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        const apiMessage = data?.error?.message || `API request failed with status ${response.status}`;
        if (response.status === 429 || apiMessage.toLowerCase().includes('quota')) {
            throw new Error('QUOTA_EXCEEDED');
        }
        throw new Error(apiMessage);
    }
    
    // Extract the text from the response
    if (data.candidates && data.candidates.length > 0) {
        const generatedText = data.candidates[0].content.parts[0].text;
        return generatedText;
    } else {
        throw new Error('No response generated');
    }
}

function getFallbackResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('college') || msg.includes('university')) {
        return "I'm studying at MVJ College of Engineering, currently in my 5th semester of B.E in CSE (Data Science).";
    }
    
    if (msg.includes('semester') || msg.includes('year')) {
        return "I'm in my 5th semester right now—juggling coursework with a bunch of side projects.";
    }
    
    if (msg.includes('projects') || msg.includes('work')) {
        return "I’ve shipped a few favourites: VaultIQ (crypto expense tracker), the Online Quiz Streamlit app, a Movie Recommender built with Next.js/NestJS, and a React Minesweeper clone. Want details on any of them?";
    }
    
    if (msg.includes('resume') || msg.includes('cv')) {
        return "I can send over my resume—tap the Download Resume button or let me know the email address you'd like me to share it with.";
    }
    
    if (msg.includes('skills') || msg.includes('stack')) {
        return "I focus on React + TypeScript on the frontend, Node/Python on the backend, and I design my own UI/UX in Figma. I’m comfortable with databases like MongoDB and PostgreSQL too.";
    }
    
    if (msg.includes('contact') || msg.includes('email') || msg.includes('phone')) {
        return "You can reach me at shashankva05@gmail.com or call/WhatsApp me at +91 7022742719.";
    }
    
    if (msg.includes('interest') || msg.includes('hobby') || msg.includes('free time')) {
        return "Outside of tech, I'm usually on a cricket ground, playing badminton, or sketching new UI ideas.";
    }
    
    if (msg.includes('hackathon') || msg.includes('achievement')) {
        return "I was the runner-up at the PIXELGENESIS Web3 Hackathon for building a decentralized digital vault tailored for universities.";
    }
    
    if (msg.includes('how are you') || msg.includes('how\'re you') || msg.includes('how r u')) {
        return "Doing great! Been refining VaultIQ lately and exploring new UI micro-interactions across my portfolio.";
    }
    
    return "Thanks for asking! I'm Shashank VA, a full-stack dev + designer from Bangalore. I love talking about projects, tech stack, internships, or anything career-related—just let me know what you're curious about.";
}

function getPortfolioAnswer(userMessage) {
    const msg = userMessage.toLowerCase();
    
    const quickFacts = [
        { keywords: ['gender'], response: "I'm male." },
        { keywords: ['where', 'from'], response: "I'm from Bangalore, India." },
        { keywords: ['college', 'study'], response: "I'm studying at MVJ College of Engineering, pursuing B.E in CSE (Data Science)." },
        { keywords: ['semester'], response: "I'm currently in my 5th semester." },
        { keywords: ['interests'], response: "Cricket, badminton, and tinkering with UI ideas keep me energized outside work." },
        { keywords: ['phone'], response: "You can reach me at +91 7022742719." },
        { keywords: ['email'], response: "Drop me a note anytime at shashankva05@gmail.com." },
        { keywords: ['location'], response: "I’m based out of Bangalore, India." },
        { keywords: ['resume'], response: "Tap the Download Resume button in the Projects section, or I can email it if you share an address." },
        { keywords: ['portfolio', 'link'], response: "You’re already here! Bookmark https://shashankportfolio-547c0.web.app." },
        { keywords: ['hackathon'], response: "I was Runner Up at the PIXELGENESIS Web3 Hackathon for building a decentralized digital vault for universities." },
        { keywords: ['projects completed'], response: "The Projects Completed stat updates automatically—right now I've shipped everything you see under Web2, Web3, and Gaming sections." },
        { keywords: ['project count'], response: "Project count keeps growing; currently it covers Movie Recommender, Online Quiz, VaultIQ, and Minesweeper." }
    ];
    
    for (const fact of quickFacts) {
        if (fact.keywords.every(keyword => msg.includes(keyword))) {
            return fact.response;
        }
    }
    
    if (msg.includes('projects')) {
        return "I’ve built Movie Recommender, Online Quiz (Streamlit), VaultIQ (crypto expense tracker), and the Minesweeper game. Ask me about any one for details.";
    }
    
    const flattenedProjects = Object.values(projectsData).flat();
    const matchedProject = flattenedProjects.find(project => msg.includes(project.title.toLowerCase()));
    if (matchedProject) {
        return `${matchedProject.title}: ${matchedProject.description}\nTech: ${matchedProject.technologies.join(', ')}\nDemo: ${matchedProject.demoLink}\nGitHub: ${matchedProject.githubLink || 'Private repo'}`;
    }
    
    if (msg.includes('extra mile') || msg.includes('achievement')) {
        return "Extra Mile highlight: Runner Up at PIXELGENESIS Web3 Hackathon for building a decentralized digital vault for universities.";
    }
    
    if (msg.includes('skills')) {
        return "Primary stack: React + TypeScript on the frontend, Node.js/Python on the backend, Tailwind/Figma for UI, and MongoDB/PostgreSQL for data.";
    }
    
    return null;
}

// Send message on button click
chatSend.addEventListener('click', sendMessage);

// Send message on Enter key
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// EmailJS Configuration
const EMAILJS_PUBLIC_KEY = 'EPBADoAjrrcgUd_jc';
const EMAILJS_SERVICE_ID = 'service_25clfzm';
const EMAILJS_TEMPLATE_ID = 'template_w9sc7v2';

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// Form submission handling with EmailJS
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    
    // Check if EmailJS is configured
    if (EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
        alert('EmailJS is not configured yet. Please set up your EmailJS credentials.');
        return;
    }
    
    // Disable button and show loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    
    try {
        // Send email using EmailJS
        const result = await emailjs.sendForm(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            e.target
        );
        
        console.log('Email sent successfully:', result);
        
        // Show success message
        alert('✅ Message sent successfully! Thank you for reaching out. I will get back to you soon!');
        
        // Reset form
        e.target.reset();
        
    } catch (error) {
        console.error('Error sending email:', error);
        alert('❌ Oops! Something went wrong. Please try again or email me directly at shashankva05@gmail.com');
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});

// Add active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    updateScrollIndicators();
});

function updateScrollIndicators() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;

    if (scrollTopBtn) {
        if (scrollTop > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }
}

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Quick action buttons
if (quickActionButtons && quickActionButtons.length > 0) {
    quickActionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const presetMessage = button.getAttribute('data-message');
            if (!presetMessage || chatSend.disabled) return;
            chatInput.value = presetMessage;
            sendMessage();
        });
    });
}

// Initialize on load
updateScrollIndicators();

// Project Categories and Data
const projectsData = {
    web3: [
        // Add your Web3 projects here
    ],
    web2: [
        {
            title: "Movie Recommender",
            description: "Full-stack movie recommendation system built with Next.js, NestJS, and PostgreSQL. Features AI-powered recommendations, user profiles, watch lists, and legal streaming links.",
            image: "https://i.ibb.co/VYwmQt5z/Gemini-Generated-Image-q7uyfiq7uyfiq7uy.png",
            technologies: ["Next.js", "NestJS", "PostgreSQL", "TypeScript", "Prisma", "Tailwind CSS"],
            demoLink: "https://movie-recommender-katqrh8ls-shashank-vas-projects.vercel.app",
            githubLink: "https://github.com/Shashank-V-A/movie-recommender"
        },
        {
            title: "Online-Quiz",
            description: "Interactive online quiz application built with Streamlit. Features user registration, quiz interface, and real-time feedback system with a clean and modern UI.",
            image: "https://i.ibb.co/Y6nzsQw/online-quiz-app-showing-test-results-on-tablet-screen-vector.jpg?cache=" + Math.random(),
            technologies: ["Python", "Streamlit", "Web App", "UI/UX"],
            demoLink: "https://online-quiz-4hytinplkjhu8x2imsoc7k.streamlit.app/",
            githubLink: "https://github.com/Shashank-V-A/Online-Quiz.git"
        },
        {
            title: "VaultIQ",
            description: "Crypto expense tracker web app. Track portfolios, categorize transactions, and visualize spend/performance.",
            image: "https://i.ibb.co/5gYQJzsR/Gemini-Generated-Image-fjgti0fjgti0fjgt.png",
            technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
            demoLink: "https://vault-2pkv06eqb-shashank-vas-projects.vercel.app",
            githubLink: "https://github.com/Shashank-V-A/VaultIQ.git"
        }
    ],
    gaming: [
        {
            title: "Minesweeper Game",
            description: "Classic Minesweeper game built with React and TypeScript. Features multiple difficulty levels, timer, flag system, and smooth gameplay.",
            image: "https://i.ibb.co/xtr33QXF/Minesweeper.png",
            tags: ["React", "TypeScript", "Game Logic"],
            projectLink: "/minesweeper/index.html",
            demoLink: "/minesweeper/index.html"
        }
    ]
};

// Function to count and update projects count
function updateProjectsCount() {
    let totalProjects = 0;
    
    // Count projects across all categories
    Object.keys(projectsData).forEach(category => {
        if (Array.isArray(projectsData[category])) {
            totalProjects += projectsData[category].length;
        }
    });
    
    // Update the projects count display
    const projectsCountElement = document.getElementById('projectsCount');
    if (projectsCountElement) {
        projectsCountElement.textContent = totalProjects + '+';
    }
}

// Update projects count - script runs after DOM is loaded
updateProjectsCount();

// Project Tab Functionality
const projectTabs = document.querySelectorAll('.project-tab');
const projectsGrid = document.getElementById('projectsGrid');

projectTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        projectTabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Get category
        const category = tab.getAttribute('data-category');
        
        // Display projects for that category
        displayProjects(category);
    });
});

function displayProjects(category) {
    console.log('Displaying projects for category:', category);
    const projects = projectsData[category];
    console.log('Projects found:', projects);
    
    if (!projects || projects.length === 0) {
        console.log('No projects found, showing empty state');
        // Show empty state
        projectsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📂</div>
                <h3>No Projects Yet</h3>
                <p>Projects in the ${category.toUpperCase()} category will appear here soon!</p>
            </div>
        `;
        return;
    }
    
    // Clear grid
    projectsGrid.innerHTML = '';
    
    console.log('Rendering', projects.length, 'projects');
    
    // Add projects
    projects.forEach((project, index) => {
        console.log('Rendering project:', project.title);
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
        projectCard.style.opacity = '0';
        
        projectCard.innerHTML = `
            <div class="project-image" style="background: #2d3748;">
                <img src="${project.image}" alt="${project.title}" class="project-img">
                <div class="project-overlay">
                    <a href="${project.demoLink}" class="project-link" target="_blank">Live Demo</a>
                </div>
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${(project.tags || project.technologies || []).map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

// Initialize with Web3 category
displayProjects('web3');

// Add scroll animation to elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.skill-card, .stat, .contact-item').forEach(el => {
    observer.observe(el);
});


