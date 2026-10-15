import PokemonPairCard, { PairActionButton } from '@/components/soullink/pokemon-pair-card';
import { PokemonPairType } from '@/types';
import { Lock, LockOpen, Minus } from 'lucide-react';

interface PokemonPartyProps {
    partyPairs: (PokemonPairType | null)[];
    removeFromParty: (event: React.MouseEvent<HTMLDivElement>, pair: PokemonPairType) => void;
    setLoadedPair: (pair: PokemonPairType) => void;
    lockedPairs: number[];
    setLockedPairs: (lockedPairs: number[]) => void;
}

export default function PokemonParty({ partyPairs, removeFromParty, setLoadedPair, lockedPairs, setLockedPairs }: PokemonPartyProps) {
    function setLockStatus(pairID: number) {
        if (lockedPairs.includes(pairID)) {
            setLockedPairs(lockedPairs.filter((id) => id !== pairID));
        } else {
            setLockedPairs([...lockedPairs, pairID]);
        }
    }

    return (
        <section className="flex cursor-[url('/storage/PCHand.png'),_pointer] flex-col items-center">
            {partyPairs.map((pair, index) => (
                <div className="mb-4 flex" key={index}>
                    {pair ? (
                        <div className="flex items-center">
                            <div onClick={() => setLockStatus(pair.id)} className="mr-2 rounded-sm p-2 transition-colors hover:bg-accent">
                                {lockedPairs.includes(pair.id) ? <Lock /> : <LockOpen />}
                            </div>
                            <PokemonPairCard
                                pair={pair}
                                onClick={() => setLoadedPair(pair)}
                                className="group shadow-lg transition-transform hover:scale-105"
                            >
                                <PairActionButton onClick={(event) => removeFromParty(event, pair)} className="bg-red-600 p-0">
                                    <Minus color="white" />
                                </PairActionButton>
                            </PokemonPairCard>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <img className="h-13.5 lg:h-18" src="/storage/light_grey_pokeball.png" alt="" />
                            <hr className="w-5 border-1 border-t border-dashed border-[#ff1c1c] bg-white text-white dark:bg-black" />
                            <img className="h-13.5 lg:h-18" src="/storage/light_grey_pokeball.png" alt="" />
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
}
