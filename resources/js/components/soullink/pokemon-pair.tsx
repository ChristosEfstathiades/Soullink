const typeColors: { [key: string]: string } = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

export default function PokemonPair({
  pair,
  setLoadedPair,
}: {
  pair: any;
  setLoadedPair?: (pair: any) => void;
}) {
  const playerOneColor = typeColors[pair.player_one_pokemon_primary_type] || '#FFFFFF';
  const playerTwoColor = typeColors[pair.player_two_pokemon_primary_type] || '#FFFFFF';

  return (
    <div
      onClick={() => setLoadedPair && setLoadedPair(pair)}
      className="rounded-4xl flex shrink-0 overflow-hidden transition-transform hover:scale-105 relative shadow-2xl"
    >
      {/* Gradient background layer */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          background: `linear-gradient(to right, ${playerOneColor},rgba(255, 255, 255, 0.85) 50%, ${playerTwoColor})`,
        }}
      />

      {/* Pokémon images layer */}
      <div className="relative flex w-full justify-between items-center z-10">
        <img
          draggable="false"
          className="w-13.5 lg:w-18"
          src={`/storage/${pair.player_one_pokemon_name}.png`}
          alt={pair.player_one_pokemon_name}
        />
        <img
          draggable="false"
          className="w-13.5 lg:w-18"
          src={`/storage/${pair.player_two_pokemon_name}.png`}
          alt={pair.player_two_pokemon_name}
        />
      </div>
    </div>
  );
}
