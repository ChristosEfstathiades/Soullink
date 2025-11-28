<?php

namespace App\Services;

use App\Models\Save;
use Illuminate\Support\Facades\Http;

class PokemonService
{
    private array $fairyPokemon = [
        'cleffa',
        'clefairy',
        'clefable',
        'granbull',
        'snubbull',
        'togepi',
        'togetic',
        'togekiss',
    ];

    /**
     * Fetch full Pokémon data from the API
     */
    public function fetchPokemonData(string $pokemonName): array
    {
        $response = Http::timeout(5) // Connection timeout
            ->get('https://pokeapi.co/api/v2/pokemon/'.strtolower($pokemonName));

        if ($response->failed()) {
            // Throw an exception with status code and error message
            throw new \RuntimeException(
                'Failed to fetch Pokemon data: '.$response->body(),
                $response->status()
            );
        }

        return $response->json();
    }

    /**
     * Fetch Pokémon types (primary & secondary).
     */
    public function fetchPokemonTypes(string $pokemonName, Save $save): array
    {
        // dd(1);
        $pokemonData = $this->fetchPokemonData($pokemonName);

        $types = array_map(fn ($type) => $type['type']['name'], $pokemonData['types']);

        // Ensure exactly two elements, second can be null
        if (count($types) === 1) {
            $types[1] = null;
        }

        return $this->applySettings($types, $pokemonName, $save);
    }

    public function batchFetchPokemonTypes(array $pokemonNames, Save $save): array
    {
        $responses = Http::timeout(5) // Connection timeout
            ->pool(function ($pool) use ($pokemonNames) {
                return array_map(function ($pokemonName) use ($pool) {
                    return $pool->get('https://pokeapi.co/api/v2/pokemon/'.strtolower($pokemonName));
                }, $pokemonNames);
            });

        $result = [];
        foreach ($responses as $index => $response) {
            if ($response->failed()) {
                throw new \RuntimeException(
                    'Failed to fetch Pokemon data: '.$response->body(),
                    $response->status()
                );
            }

            $pokemonData = $response->json();
            $types = array_map(fn ($type) => $type['type']['name'], $pokemonData['types']);

            if (count($types) === 1) {
                $types[1] = null;
            }

            $result[$pokemonNames[$index]] = $this->applySettings($types, $pokemonNames[$index], $save);
        }
        // dd($result);

        return $result;
    }

    /**
     * Swap Normal/Flying order.
     */
    public function swapNormalFlyingOrder(array $pokemonTypes): array
    {
        if ($pokemonTypes[0] === 'normal' && $pokemonTypes[1] === 'flying') {
            return ['flying', 'normal'];
        }

        return $pokemonTypes;
    }

    /**
     * Revert Fairy typing for special Pokémon.
     */
    public function revertFairyTyping(array $pokemonTypes, string $pokemon): array
    {
        if ($pokemonTypes[0] == 'fairy') {
            if (in_array(strtolower($pokemon), $this->fairyPokemon)) {
                return ['normal', $pokemonTypes[1]];
            }
        }

        return $pokemonTypes;
    }

    public function applySettings($types, $pokemonName, Save $save): array
    {
        if ($save->swap_normal_flying_order) {
            $types = $this->swapNormalFlyingOrder($types);
        }

        if ($save->revert_fairy_typing) {
            $types = $this->revertFairyTyping($types, $pokemonName);
        }

        return $types;
    }
}
