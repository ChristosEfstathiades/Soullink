

export default function PokemonPair({pair, setLoadedPair}: {pair: any, setLoadedPair?: (pair: any) => void}) {
  return (
    <div
      draggable="true"
      className="bg-white/75 rounded-4xl flex shrink-0 cursor-[url('/storage/PCHand.png'),_pointer] shadow-md"
      onClick={() => setLoadedPair && setLoadedPair(pair)}
    >
      <img draggable="false" className="w-18" src={`/storage/${pair.player_one_pokemon_name}.png`} alt={pair.player_one_pokemon_name} />
      <div className="w-px h-full bg-black/20"></div>
      <img draggable="false" className="w-18" src={`/storage/${pair.player_two_pokemon_name}.png`} alt={pair.player_two_pokemon_name} />
    </div>
  );
}