import type { TransformerData } from '@/app/object-detection/page';
import { useMemo } from 'react';

interface FrameProps {
    object: TransformerData;
}

export default function Frame({ object }: FrameProps) {
    const { box, label } = object;
    const { xmax, xmin, ymax, ymin } = box;

    const color = useMemo(() => getRandomHexColor(), []);

    const left = 100 * xmin + '%';
    const top = 100 * ymin + '%';
    const width = 100 * (xmax - xmin) + '%';
    const height = 100 * (ymax - ymin) + '%';

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
