import { TransformerData } from '@/app/page';
import { useMemo } from 'react';

interface FrameProps {
    object: TransformerData;
    scaleX: number;
    scaleY: number;
}

export default function Frame({ object, scaleX, scaleY }: FrameProps) {
    const { box, label } = object;
    const { xmax, xmin, ymax, ymin } = box;

    const color = useMemo(() => getRandomHexColor(), []);

    const left = `${xmin * scaleX}px`;
    const top = `${ymin * scaleY}px`;
    const width = `${(xmax - xmin) * scaleX}px`;
    const height = `${(ymax - ymin) * scaleY}px`;

    return (
        <>
            <span
                className="absolute px-3 text-sm text-white"
                style={{
                    left,
                    top,
                    backgroundColor: color,
                }}>
                {label}
            </span>
            <div
                className="absolute"
                style={{
                    left,
                    top,
                    width,
                    height,
                    border: `2px solid ${color}`,
                }}
            />
        </>
    );
}

function getRandomHexColor(): string {
    return (
        '#' +
        Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, '0')
    );
}
