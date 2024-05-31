import React from 'react';

const ModelHeader = ({ heading, sub }: { heading: string; sub: string }) => {
    return (
        <div>
            <h1 className="text-4xl font-bold text-zinc-800">{heading}</h1>
            <h3 className="text-lg text-zinc-600">{sub}</h3>
        </div>
    );
};

export default ModelHeader;
