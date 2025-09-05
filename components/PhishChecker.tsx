
import React, { useState, useCallback } from 'react';
import type { PhishingResult } from '../types';
import { analyzePhishingThreat } from '../services/geminiService';

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const CheckCircleIcon = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XCircleIcon = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ResultDisplay: React.FC<{ result: PhishingResult }> = ({ result }) => {
    const isPhishing = result.prediction === 'PHISHING';
    const probabilityColor = isPhishing ? 'bg-danger' : 'bg-success';
    const textColor = isPhishing ? 'text-danger' : 'text-success';

    return (
        <div className="mt-6 p-6 bg-secondary border border-border-color rounded-lg animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Analysis Result</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex flex-col items-center">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center ${isPhishing ? 'bg-danger/20' : 'bg-success/20'}`}>
                       {isPhishing ? <XCircleIcon className="w-20 h-20 text-danger" /> : <CheckCircleIcon className="w-20 h-20 text-success" />}
                    </div>
                    <span className={`text-2xl font-bold mt-3 ${textColor}`}>{result.prediction}</span>
                </div>
                <div className="flex-1 w-full">
                    <p className="text-dark-text mb-1">Confidence Score</p>
                    <div className="w-full bg-border-color rounded-full h-4 mb-2">
                        <div className={`${probabilityColor} h-4 rounded-full`} style={{ width: `${result.probability * 100}%` }}></div>
                    </div>
                     <p className="text-right font-mono text-lg">{ (result.probability * 100).toFixed(1) }%</p>
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Feature Breakdown:</h4>
                        <ul className="space-y-1 text-sm">
                            {result.features.map(feature => (
                                <li key={feature.name} className="flex items-center">
                                    {feature.detected ? 
                                        <XCircleIcon className="h-4 w-4 mr-2 text-warning" /> : 
                                        <CheckCircleIcon className="h-4 w-4 mr-2 text-success" />
                                    }
                                    <span className={feature.detected ? 'text-light-text' : 'text-dark-text'}>{feature.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const PhishChecker: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<PhishingResult | null>(null);

    // FIX: Replace mock API call with a real call to the Gemini API via the service function.
    const handleAnalysis = useCallback(async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);
        setResult(null);

        try {
            const analysisResult = await analyzePhishingThreat(inputText);
            setResult(analysisResult);
        } catch (error) {
            console.error("Failed to analyze content:", error);
            // The service layer handles the error and returns a displayable result.
        } finally {
            setIsLoading(false);
        }
    }, [inputText]);
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-light-text mb-2">Phishing Threat Analyzer</h2>
            <p className="text-dark-text mb-6">Enter a URL, email content, or any text to check for potential phishing threats.</p>
            
            <div className="w-full">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g., 'Subject: Urgent: Your account is suspended! Click here to verify: http://bit.ly/login-update...'"
                    className="w-full h-40 p-3 bg-primary border border-border-color rounded-lg focus:ring-2 focus:ring-accent focus:outline-none transition-shadow"
                    disabled={isLoading}
                />
            </div>
            
            <button
                onClick={handleAnalysis}
                disabled={isLoading || !inputText.trim()}
                className="mt-4 w-full md:w-auto px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
                {isLoading ? <LoadingSpinner /> : 'Analyze Content'}
            </button>

            {result && <ResultDisplay result={result} />}
        </div>
    );
};
