import PokemonPairCard, { PairActionButton } from '@/components/soullink/pokemon-pair-card';
import { type PokemonPairType } from '@/types';
import { Plus } from 'lucide-react';

export default function PokemonPair({
    pair,
    setLoadedPair,
    viewDeathBox,
    unavailableTypes = [],
    highlightAvailablePairs = false,
    addToParty,
}: {
    pair: PokemonPairType;
    setLoadedPair?: (pair: PokemonPairType) => void;
    viewDeathBox: boolean;
    unavailableTypes?: string[];
    highlightAvailablePairs?: boolean;
    addToParty: (event: React.MouseEvent<HTMLDivElement>, pair: PokemonPairType) => void;
}) {
    const isUnavailable =
        unavailableTypes.includes(pair.player_one_pokemon_primary_type) || unavailableTypes.includes(pair.player_two_pokemon_primary_type);

    return (
        <PokemonPairCard
            pair={pair}
            onClick={() => setLoadedPair && setLoadedPair(pair)}
            className="group shadow-2xl transition hover:scale-105"
            style={{ display: viewDeathBox ? 'none' : '', opacity: isUnavailable && highlightAvailablePairs ? 0.4 : 1 }}
        >
            <PairActionButton
                style={{ opacity: isUnavailable ? 0.3 : 0.85, display: !pair.is_alive ? 'none' : '' }}
                onClick={(event) => addToParty(event, pair)}
                className="bg-white p-0.5"
            >
                <Plus color="red" />
            </PairActionButton>
        </PokemonPairCard>
    );
}
