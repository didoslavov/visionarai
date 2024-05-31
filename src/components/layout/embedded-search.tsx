'use client';

import { EmbeddingResult } from '@/app/semantic-search/page';
import { sampleData } from '@/constants/sample-data';
import { cn } from '@/utils/cn';
import { getSimilarityColor } from '@/utils/similarity-color';
import { useState } from 'react';
import { MdAutoAwesome } from 'react-icons/md';
import Loading from '../ui/loading';

type EmbeddedSearchProps = {
    status: string;
    setStatus: (status: string) => void;
    onExtractFeatures: (texts: string[], query: string) => void;
    result: EmbeddingResult | null;
};

const EmbeddedSearch = ({ status, onExtractFeatures, result, setStatus }: EmbeddedSearchProps) => {
    const [text, setText] = useState('');
    const [query, setQuery] = useState('');
    const [attention, setAttention] = useState(false);

    const handleExtractFeatures = () => {
        setAttention(false);
        const texts = text
            .split('.')
            .join('\n')
            .split('\n')
            .filter((line) => line.trim() !== '');
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
        setQuery('Gentle rain in the nature, feels energizing!');
        setAttention(true);
    };

    return (
        <>
            <div className="mt-10">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your texts here"
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
                        className={cn(
                            'mt-4 px-6 py-2 bg-teal-700 hover:bg-teal-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-300 text-lime-50 rounded-xl',
                            attention && 'animate-pulse repeat-infinite duration-1000'
                        )}>
                        {attention ? 'Try it' : 'Search'}
                    </button>
                    <button
                        onClick={handleLoadSampleData}
                        className="mt-4 px-6 py-2 bg-lime-400 hover:bg-lime-500 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-300 text-teal-950 rounded-xl">
                        Load Sample
                    </button>
                </div>
            </div>
            {status !== 'complete' && (
                <div className="mt-4 flex items-center justify-center text-2xl text-teal-950 font-bold text-center">
                    <span className="text-3xl">Processing</span>
                    <Loading />
                </div>
            )}
            {status === 'complete' && result && (
                <div className="mt-4">
                    <h2 className="text-xl font-bold mb-4">Results:</h2>
                    {result.map(({ text, similarity }, i) => (
                        <div
                            key={i}
                            className="relative rounded-xl p-2 bg-teal-900 shadow-lg mb-8 border-2 border-dashed border-teal-900">
                            {similarity >= 50 && <MdAutoAwesome className="absolute top-2 right-2 text-lime-200 text-2xl" />}
                            <h3
                                className={cn(
                                    'text-sm text-teal-950 font-semibold mb-1 w-fit rounded-xl py-1 px-4',
                                    getSimilarityColor(similarity)
                                )}>
                                Similarity of {similarity}%
                            </h3>
                            <p className="py-2 px-6 text-lime-50 font-medium rounded mb-4">{text}</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default EmbeddedSearch;
