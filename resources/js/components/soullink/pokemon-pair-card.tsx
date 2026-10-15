import { typeColors } from '@/lib/pokemon-types';
import { cn } from '@/lib/utils';
import { type PokemonPairType } from '@/types';

export function PairSprites({ pair, lazy = false }: { pair: PokemonPairType; lazy?: boolean }) {
    const lazyProps = lazy ? ({ loading: 'lazy', decoding: 'async', width: 72, height: 72 } as const) : {};

    return (
        <div className="relative z-10 flex w-full items-center justify-between">
            {[pair.player_one_pokemon_name, pair.player_two_pokemon_name].map((name, index) => (
                <img key={index} draggable="false" className="w-13.5 lg:w-18" src={`/storage/${name}.png`} alt={name} {...lazyProps} />
            ))}
        </div>
    );
}

// Corner button shown on hover (always visible on mobile), e.g. add to / remove from party.
export function PairActionButton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('absolute right-0 bottom-0 z-49 cursor-pointer rounded-full sm:hidden sm:group-hover:block', className)} {...props} />;
}

interface PokemonPairCardProps extends React.HTMLAttributes<HTMLDivElement> {
    pair: PokemonPairType;
    lazySprites?: boolean;
}

export default function PokemonPairCard({ pair, lazySprites, className, children, ...props }: PokemonPairCardProps) {
    const playerOneColor = typeColors[pair.player_one_pokemon_primary_type] || '#FFFFFF';
    const playerTwoColor = typeColors[pair.player_two_pokemon_primary_type] || '#FFFFFF';

    return (
        <div className={cn('relative flex shrink-0 rounded-4xl', className)} {...props}>
            {/* Gradient background layer */}
            <div className="absolute inset-0 rounded-4xl" style={{ background: `linear-gradient(to right, ${playerOneColor}, ${playerTwoColor})` }} />
            {children}
            <PairSprites pair={pair} lazy={lazySprites} />
        </div>
    );
}
