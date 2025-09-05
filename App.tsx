
import React, { useState } from 'react';
import { PhishChecker } from './components/PhishChecker';
import { Chatbot } from './components/Chatbot';

type View = 'phish-checker' | 'chatbot';

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944L12 22l9-1.056v-9.447c0-1.896-.78-3.7-2.148-5.06l-.25-.25A11.95 11.95 0 0118.382 7.984z" />
    </svg>
);

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>('phish-checker');

    return (
        <div className="min-h-screen bg-primary font-sans">
            <header className="bg-secondary p-4 border-b border-border-color">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                       <ShieldIcon />
                        <h1 className="text-2xl font-bold text-light-text">CyberGuard Assistant</h1>
                    </div>
                </div>
            </header>
            
            <main className="container mx-auto p-4 md:p-8">
                <div className="bg-secondary rounded-lg border border-border-color shadow-lg overflow-hidden">
                    <nav className="flex border-b border-border-color">
                        <button
                            onClick={() => setActiveView('phish-checker')}
                            className={`flex-1 p-4 text-center font-semibold transition-colors duration-200 flex items-center justify-center ${activeView === 'phish-checker' ? 'bg-accent text-white' : 'hover:bg-gray-800 text-dark-text'}`}
                        >
                            <ShieldIcon /> Phishing Checker
                        </button>
                        <button
                            onClick={() => setActiveView('chatbot')}
                            className={`flex-1 p-4 text-center font-semibold transition-colors duration-200 flex items-center justify-center ${activeView === 'chatbot' ? 'bg-accent text-white' : 'hover:bg-gray-800 text-dark-text'}`}
                        >
                            <ChatIcon /> AI Security Chatbot
                        </button>
                    </nav>

                    <div className="p-6 md:p-8">
                        {activeView === 'phish-checker' && <PhishChecker />}
                        {activeView === 'chatbot' && <Chatbot />}
                    </div>
                </div>
                 <footer className="text-center text-dark-text mt-8">
                    <p>&copy; {new Date().getFullYear()} CyberGuard Assistant. Stay vigilant.</p>
                </footer>
            </main>
        </div>
    );
};

export default App;
