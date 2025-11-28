<?php

use App\Models\Save;
use App\Services\PokemonService;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->service = new PokemonService;

    // Fake Save settings
    $this->save = new Save([
        'swap_normal_flying_order' => false,
        'revert_fairy_typing' => false,
    ]);

});

function fakePokemonResponse($type1, $type2 = null)
{
    return [
        'types' => array_values(array_filter([
            ['type' => ['name' => $type1]],
            $type2 ? ['type' => ['name' => $type2]] : null,
        ])),
    ];
}

it('ensures sequential and batch type results match', function () {

    Http::fake([
        'pokeapi.co/*' => fn () => Http::response(
            fakePokemonResponse('fire', 'flying')
        ),
    ]);

    $pokemon = ['charizard', 'moltres', 'talonflame'];

    // Sequential
    $seqResults = [];
    foreach ($pokemon as $name) {
        $seqResults[$name] = $this->service->fetchPokemonTypes($name, $this->save);
    }

    // Batch
    $batchResults = $this->service->batchFetchPokemonTypes($pokemon, $this->save);

    expect($batchResults)->toEqual($seqResults);
});

it('benchmarks sequential vs batch performance', function () {

    // Fake different Pokémon with fake data
    Http::fake([
        'pokeapi.co/*' => function () {
            // optional simulated network delay:
            usleep(50_000); // 50ms

            return Http::response(fakePokemonResponse('water', 'ice'));
        },
    ]);

    $pokemon = [
        'squirtle', 'lapras',
    ];

    //
    // ⏱ Measure Sequential
    //
    $startSeq = microtime(true);

    foreach ($pokemon as $p) {
        $this->service->fetchPokemonTypes($p, $this->save);
    }

    $seqTime = microtime(true) - $startSeq;

    //
    // ⏱ Measure Parallel (Pool)
    //
    $startPar = microtime(true);

    $this->service->batchFetchPokemonTypes($pokemon, $this->save);

    $parTime = microtime(true) - $startPar;

    dump([
        'sequential' => $seqTime,
        'parallel' => $parTime,
    ]);

    // You can assert parallel is faster:
    expect($parTime)->toBeLessThan($seqTime);
});
