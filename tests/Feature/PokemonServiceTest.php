<?php

use App\Models\Save;
use App\Services\PokemonService;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->service = new PokemonService;
});

function pokemonTypeResponse(string $primary, ?string $secondary = null): array
{
    return [
        'types' => array_values(array_filter([
            ['type' => ['name' => $primary]],
            $secondary ? ['type' => ['name' => $secondary]] : null,
        ])),
    ];
}

function saveWith(bool $swapNormalFlying = false, bool $revertFairy = false): Save
{
    return new Save([
        'swap_normal_flying_order' => $swapNormalFlying,
        'revert_fairy_typing' => $revertFairy,
    ]);
}

it('pads single-type pokemon with a null secondary type', function () {
    Http::fake(['pokeapi.co/*' => Http::response(pokemonTypeResponse('electric'))]);

    expect($this->service->fetchPokemonTypes('pikachu', saveWith()))->toBe(['electric', null]);
});

it('returns both types for dual-type pokemon', function () {
    Http::fake(['pokeapi.co/*' => Http::response(pokemonTypeResponse('grass', 'poison'))]);

    expect($this->service->fetchPokemonTypes('bulbasaur', saveWith()))->toBe(['grass', 'poison']);
});

it('produces identical results whether fetched sequentially or in a batch', function () {
    Http::fake(['pokeapi.co/*' => Http::response(pokemonTypeResponse('fire', 'flying'))]);

    $save = saveWith();
    $pokemon = ['charizard', 'moltres', 'talonflame'];

    $sequential = [];
    foreach ($pokemon as $name) {
        $sequential[$name] = $this->service->fetchPokemonTypes($name, $save);
    }

    expect($this->service->batchFetchPokemonTypes($pokemon, $save))->toEqual($sequential);
});

it('applies the save type-normalization settings when fetching types', function () {
    Http::fake(['pokeapi.co/*' => Http::response(pokemonTypeResponse('normal', 'flying'))]);

    expect($this->service->fetchPokemonTypes('pidgey', saveWith(swapNormalFlying: true)))->toBe(['flying', 'normal']);
});

it('throws when the api request fails', function () {
    Http::fake(['pokeapi.co/*' => Http::response('Not Found', 404)]);

    $this->service->fetchPokemonTypes('missingno', saveWith());
})->throws(RuntimeException::class);
