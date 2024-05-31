'use client';

import { EmbeddingResult } from '@/app/semantic-search/page';
import { sampleData } from '@/constants/sample-data';
import { useState } from 'react';

type EmbeddedSearchProps = {
    status: string;
    setStatus: (status: string) => void;
    onExtractFeatures: (texts: string[], query: string) => void;
    result: EmbeddingResult | null;
};

const EmbeddedSearch = ({ status, onExtractFeatures, result, setStatus }: EmbeddedSearchProps) => {
    const [text, setText] = useState('');
    const [query, setQuery] = useState('');

    const handleExtractFeatures = () => {
        const texts = text.split('\n').filter((line) => line.trim() !== '');
        setStatus('processing');
        onExtractFeatures(texts, query);
    };

    const handleLoadSampleData = () => {
        setText(
            sampleData
                .map((line) => line.trim())
                .filter((line) => line.trim() !== '')
                .join('\n')
        );
    };

    return (
        <>
            <div className="mt-10">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your texts here, one per line"
                    className="w-full h-64 p-4 resize-none rounded-xl border border-teal-950 focus:outline-none focus:ring-2 bg-lime-50 focus:ring-teal-500 focus:border-transparent transition-colors duration-300"
                />
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your search query here"
                    className="w-full p-4 mt-4 rounded-xl border border-teal-950 focus:outline-none focus:ring-2 bg-lime-50 focus:ring-teal-500 focus:border-transparent transition-colors duration-300"
                />
                <div className="flex w-full justify-between">
                    <button
                        onClick={handleExtractFeatures}
                        className="mt-4 px-6 py-2 bg-teal-700 hover:bg-teal-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-300 text-lime-50 rounded-xl">
                        Search
                    </button>
                    <button
                        onClick={handleLoadSampleData}
                        className="mt-4 px-6 py-2 bg-teal-400 hover:bg-teal-500 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-300 text-teal-950 rounded-xl">
                        Load Sample
                    </button>
                </div>
            </div>
            {status === 'processing' && <div className="mt-4 text-2xl text-teal-950 font-bold">Processing...</div>}
            {status === 'complete' && result && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold">Results:</h2>
                    {result.map(({ text, similarity }, i) => (
                        <div key={i}>
                            <h3 className="text-lg font-semibold">Similarity of {similarity}%</h3>
                            <p className="bg-gray-200 p-2 rounded">{text}</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default EmbeddedSearch;
