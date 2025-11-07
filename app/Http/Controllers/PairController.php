<?php

namespace App\Http\Controllers;

use App\Models\Pair;
use App\Models\Save;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PairController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Save $save)
    {
        $request->validate([
            'playerOnePokemon' => 'required|string|max:255',
            'playerTwoPokemon' => 'required|string|max:255',
            'playerOneNickname' => 'nullable|string|max:12',
            'playerTwoNickname' => 'nullable|string|max:12',
        ]);

        $pokemonOneTypes = $this->fetchPokemonTypes($request->playerOnePokemon);
        $pokemonTwoTypes = $this->fetchPokemonTypes($request->playerTwoPokemon);

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
            'is_alive' => true,
        ]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Pair $pair)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pair $pair)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Save $save, Pair $pair)
    {
        $request->validate([
            'playerOnePokemon' => 'nullable|string|max:255',
            'playerTwoPokemon' => 'nullable|string|max:255',
            'playerOneNickname' => 'nullable|string|max:12',
            'playerTwoNickname' => 'nullable|string|max:12',
            'isAlive' => 'nullable|string',
        ]);
        if (! is_null($request->playerOnePokemon)) {
            $pokemonOneTypes = $this->fetchPokemonTypes($request->playerOnePokemon);
        } else {
            $pokemonOneTypes = [$pair->player_one_pokemon_primary_type, $pair->player_one_pokemon_secondary_type];
        }
        if (! is_null($request->playerTwoPokemon)) {
            $pokemonTwoTypes = $this->fetchPokemonTypes($request->playerTwoPokemon);
        } else {
            $pokemonTwoTypes = [$pair->player_two_pokemon_primary_type, $pair->player_two_pokemon_secondary_type];
        }

        if ($pokemonOneTypes[0] == $pokemonTwoTypes[0]) {
            return back()->withErrors(['samePrimaryType' => 'Both Pokémon cannot share the same primary type.']);
        }

        // Gate::authorize('update', $pair);
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

    private function fetchPokemonData($pokemonName)
    {
        $curl = curl_init();

        $connectionTimeout = 5;

        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://pokeapi.co/api/v2/pokemon/'.strtolower($pokemonName),
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_CONNECTTIMEOUT => $connectionTimeout,
        ]);

        curl_setopt_array($curl, [
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTPHEADER => [],
            CURLOPT_POSTFIELDS => [],
        ]);

        $response = curl_exec($curl);

        if ($response === false) {
            $exceptionMessage = curl_error($this->curl);

            $exceptionCode = curl_errno($this->curl);

            throw new \RuntimeException($exceptionMessage, $exceptionCode);
        }

        curl_close($curl);

        return json_decode($response, true);
    }

    private function fetchPokemonTypes($pokemonName)
    {
        $pokemonData = $this->fetchPokemonData($pokemonName);

        $types = [];
        foreach ($pokemonData['types'] as $type) {
            $types[] = $type['type']['name'];
        }
        if (count($types) == 1) {
            $types[1] = null;
        }

        return $types;
    }
}
