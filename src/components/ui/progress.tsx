export function Progress({ value }: { value: number }) {
    return (
        <div className="w-full bg-lime-50 rounded-xl h-2 mt-2 overflow-hidden">
            <div style={{ width: `${value}%` }} className="bg-teal-500 h-full transition-width duration-300 ease-in-out" />
        </div>
    );
}
