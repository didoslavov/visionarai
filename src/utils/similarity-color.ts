export function getSimilarityColor(similarity: number) {
    if (similarity <= 100 && similarity >= 90) {
        return 'bg-lime-800 text-lime-50';
    }
    if (similarity <= 90 && similarity >= 80) {
        return 'bg-lime-700 text-lime-50';
    }
    if (similarity <= 80 && similarity >= 70) {
        return 'bg-lime-600 text-lime-50';
    }
    if (similarity <= 70 && similarity >= 60) {
        return 'bg-lime-500';
    }
    if (similarity <= 60 && similarity >= 50) {
        return 'bg-lime-400';
    }
    if (similarity <= 50 && similarity >= 40) {
        return 'bg-lime-300';
    }
    if (similarity <= 40 && similarity >= 30) {
        return 'bg-lime-200';
    }
    if (similarity <= 30 && similarity >= 20) {
        return 'bg-lime-100';
    }
    if (similarity <= 20 && similarity >= 10) {
        return 'bg-red-200';
    }
    return 'bg-red-400';
}
