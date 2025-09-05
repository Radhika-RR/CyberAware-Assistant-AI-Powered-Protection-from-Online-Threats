
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage, Source } from '../types';
import { getCybersecurityInfo } from '../services/geminiService';

const BotIcon = () => (
    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-text" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    </div>
);


const SourcesDisplay: React.FC<{ sources: Source[] }> = ({ sources }) => {
    if (sources.length === 0) return null;

    return (
        <div className="mt-4 border-t border-border-color pt-3">
            <h4 className="text-sm font-semibold text-dark-text mb-2">Sources:</h4>
            <ul className="space-y-2">
                {sources.map((source, index) => (
                    <li key={index}>
                        <a
                            href={source.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:underline text-sm break-all"
                        >
                            <span className="font-bold">[{index + 1}]</span> {source.title}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-2">
        <div className="w-2 h-2 bg-dark-text rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-dark-text rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-dark-text rounded-full animate-bounce"></div>
    </div>
);

export const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'initial', sender: 'bot', text: "Hello! I'm the CyberGuard AI Assistant. How can I help you with your cybersecurity questions today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const botResponseData = await getCybersecurityInfo(input);

        const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: botResponseData.summary,
            sources: botResponseData.sources
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    }, [input, isLoading]);

    return (
        <div>
            <h2 className="text-2xl font-bold text-light-text mb-2">AI Security Chatbot</h2>
            <p className="text-dark-text mb-6">Ask me anything about cybersecurity, from defining terms to best practices.</p>

            <div className="h-[500px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 bg-primary border border-border-color rounded-t-lg space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && <BotIcon />}
                            <div className={`max-w-md p-3 rounded-lg ${msg.sender === 'bot' ? 'bg-secondary' : 'bg-accent text-white'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                {msg.sources && <SourcesDisplay sources={msg.sources} />}
                            </div>
                             {msg.sender === 'user' && <UserIcon />}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-3">
                            <BotIcon />
                            <div className="max-w-md p-3 rounded-lg bg-secondary">
                               <TypingIndicator />
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="border-t border-border-color p-4 bg-secondary rounded-b-lg flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., How does multi-factor authentication work?"
                        className="flex-1 p-2 bg-primary border border-border-color rounded-l-lg focus:ring-2 focus:ring-accent focus:outline-none transition-shadow disabled:opacity-50"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="px-4 py-2 bg-accent text-white font-bold rounded-r-lg hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};
