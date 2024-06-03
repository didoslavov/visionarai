export function getSimilarityColor(similarity: number) {
    const ranges = [
        { min: 90, class: 'bg-lime-800 text-lime-50' },
        { min: 80, class: 'bg-lime-700 text-lime-50' },
        { min: 70, class: 'bg-lime-600 text-lime-50' },
        { min: 60, class: 'bg-lime-500' },
        { min: 50, class: 'bg-lime-400' },
        { min: 40, class: 'bg-lime-300' },
        { min: 30, class: 'bg-lime-200' },
        { min: 20, class: 'bg-lime-100' },
        { min: 10, class: 'bg-red-200' },
    ];

    for (const range of ranges) {
        if (similarity >= range.min) {
            return range.class;
        }
    }

    return 'bg-red-400';
}
