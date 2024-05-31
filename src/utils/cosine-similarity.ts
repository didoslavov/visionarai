export function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((prev, current, i) => prev + current * (b[i] || 0), 0);
    const magnitudeA = Math.sqrt(a.reduce((prev, current) => prev + Math.pow(current, 2), 0));
    const magnitudeB = Math.sqrt(b.reduce((prev, current) => prev + Math.pow(current, 2), 0));

    return dotProduct / (magnitudeA * magnitudeB);
}
