<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePairRequest;
use App\Http\Requests\UpdatePairRequest;
use App\Models\Pair;
use App\Models\Save;
use App\Services\PokemonService;
use Illuminate\Support\Facades\Gate;

class PairController extends Controller
{
    private $fairyPokemon = [
        'cleffa',
        'clefairy',
        'clefable',
        'granbull',
        'snubbull',
        'togepi',
        'togetic',
        'togekiss',
    ];

    private PokemonService $pokemonService;

    public function __construct(PokemonService $pokemonService)
    {
        $this->pokemonService = $pokemonService;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePairRequest $request, Save $save)
    {
        $pokemonOneTypes = $this->pokemonService->fetchPokemonTypes($request->playerOnePokemon, $save);
        $pokemonTwoTypes = $this->pokemonService->fetchPokemonTypes($request->playerTwoPokemon, $save);

        if ($pokemonOneTypes[0] == $pokemonTwoTypes[0]) {
            return back()->withErrors(['samePrimaryType' => 'Both Pokémon cannot share the same primary type.']);
        }

        $pair = Pair::create([
            'save_id' => $save->id,
            'player_one_pokemon_name' => $request->playerOnePokemon,
            'player_two_pokemon_name' => $request->playerTwoPokemon,
            'player_one_pokemon_nickname' => $request->playerOneNickname,
            'player_two_pokemon_nickname' => $request->playerTwoNickname,
            'player_one_pokemon_primary_type' => $pokemonOneTypes[0],
            'player_one_pokemon_secondary_type' => $pokemonOneTypes[1],
            'player_two_pokemon_primary_type' => $pokemonTwoTypes[0],
            'player_two_pokemon_secondary_type' => $pokemonTwoTypes[1],
            'is_alive' => 1,
        ]);

        return back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePairRequest $request, Save $save, Pair $pair)
    {
        if (! is_null($request->playerOnePokemon)) {
            $pokemonOneTypes = $this->pokemonService->fetchPokemonTypes($request->playerOnePokemon, $save);

        } else {
            $pokemonOneTypes = [$pair->player_one_pokemon_primary_type, $pair->player_one_pokemon_secondary_type];
        }
        if (! is_null($request->playerTwoPokemon)) {
            $pokemonTwoTypes = $this->pokemonService->fetchPokemonTypes($request->playerTwoPokemon, $save);
        } else {
            $pokemonTwoTypes = [$pair->player_two_pokemon_primary_type, $pair->player_two_pokemon_secondary_type];
        }

        if ($pokemonOneTypes[0] == $pokemonTwoTypes[0]) {
            return back()->withErrors(['samePrimaryType' => 'Both Pokémon cannot share the same primary type.']);
        }

        $pair->update([
            'player_one_pokemon_name' => $request->playerOnePokemon ?? $pair->player_one_pokemon_name,
            'player_two_pokemon_name' => $request->playerTwoPokemon ?? $pair->player_two_pokemon_name,
            'player_one_pokemon_nickname' => $request->playerOneNickname ?? $pair->player_one_pokemon_nickname,
            'player_two_pokemon_nickname' => $request->playerTwoNickname ?? $pair->player_two_pokemon_nickname,
            'player_one_pokemon_primary_type' => $pokemonOneTypes[0],
            'player_one_pokemon_secondary_type' => $pokemonOneTypes[1],
            'player_two_pokemon_primary_type' => $pokemonTwoTypes[0],
            'player_two_pokemon_secondary_type' => $pokemonTwoTypes[1],
            'is_alive' => $request->isAlive ? 1 : 0,
        ]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Save $save, Pair $pair)
    {
        Gate::authorize('delete', $pair);

        $pair->delete();

        return back();
    }
}
