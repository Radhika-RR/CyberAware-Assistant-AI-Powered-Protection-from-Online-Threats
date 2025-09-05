
export interface PhishingResult {
    prediction: 'SAFE' | 'PHISHING';
    probability: number;
    features: {
        name: string;
        detected: boolean;
    }[];
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    sources?: Source[];
}

export interface Source {
    title: string;
    link: string;
}
