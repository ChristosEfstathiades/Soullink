export default function BaseStat({ category, stat }: { category: number; stat: number }) {
    const categories = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
    const ranges = [
        { min: 1, max: 29, color: '#F34444' },
        { min: 30, max: 59, color: '#FF7F0F' },
        { min: 60, max: 99, color: '#FFDD57' },
        { min: 100, max: 119, color: '#A0E515' },
        { min: 120, max: 149, color: '#23CD5E' },
        { min: 150, max: 255, color: '#00c2b8' },
    ];
    const range = ranges.find((r) => stat >= r.min && stat <= r.max);
    const statPercentage = stat < 150 ? Math.round((stat / 150) * 100) : 100; // anything above 150 is just capped to 100%

    return (
        <li className="mb-1 flex items-center">
            <p className="w-8">{categories[category]}</p>
            <p className="w-6.5">{stat}</p>
            <div className="min-w-25">
                <div style={{ width: `${statPercentage}%`, backgroundColor: range?.color }} className={`h-2 rounded border border-black/15`}></div>
            </div>
        </li>
    );
}
