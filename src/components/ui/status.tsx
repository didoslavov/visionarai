import React from 'react';
import { BiCheckDouble } from 'react-icons/bi';
import { Progress } from './progress';

const Status = ({ ready, progress }: { ready: boolean | null; progress: number }) => {
    return (
        <>
            {ready ? (
                <div className="flex font-bold items-center justify-end gap-2 text-emerald-600">
                    <p>AI Model Ready</p>
                    <BiCheckDouble className="text-3xl" />
                </div>
            ) : (
                <div className="text-end">
                    <p>AI Model status</p>
                    {!ready && <Progress value={progress} />}
                </div>
            )}
        </>
    );
};

export default Status;
