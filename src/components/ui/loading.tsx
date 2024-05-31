import React from 'react';

function Loading() {
    return (
        <div className="flex w-fit space-x-2 rounded-2xl bg-primary px-3 pt-5">
            <div className="bg-teal-950 animate-pulse1 h-2 w-2 rounded-full"></div>
            <div className="bg-teal-950 animate-pulse2 h-2 w-2 rounded-full"></div>
            <div className="bg-teal-950 animate-pulse3 h-2 w-2 rounded-full"></div>
        </div>
    );
}

export default Loading;
