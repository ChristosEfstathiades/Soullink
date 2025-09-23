import { useEffect } from "react";
import { LoaderCircle } from 'lucide-react';


export default function PokemonPairEditor({pair}: {pair: any}) {
  // TODO: could move to onClick in PokemonPair, but this is fine for now
  useEffect(() => {
    if (pair) {
      console.log('pair changed', pair);
    }
  }, [pair]);
  if (pair) {
    return (
      <section className="grow">
              <div>
                  <h2>
                    {pair.player_one_pokemon_nickname ? pair.player_one_pokemon_nickname : pair.player_one_pokemon_name} and {pair.player_two_pokemon_nickname ? pair.player_two_pokemon_nickname : pair.player_two_pokemon_name}
                  </h2>
                  {/* <LoaderCircle className="h-16 w-16 animate-spin" /> */}
                  <div>
                  <p>Player One: {pair.player_one_pokemon_name}</p>
                  </div>

                  <div>
                  <p>Player Two: {pair.player_two_pokemon_name}</p>
                  </div>
              </div>
      </section>
    );
  } else {
    return (
      <section className="grow flex items-center justify-center">
        <p className="text-center">Click a pair to edit it</p>
      </section>
    );
  }
}
