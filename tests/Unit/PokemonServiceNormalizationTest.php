<?php

use App\Services\PokemonService;

beforeEach(function () {
    $this->service = new PokemonService;
});

it('swaps a normal/flying pair into flying/normal', function () {
    expect($this->service->swapNormalFlyingOrder(['normal', 'flying']))->toBe(['flying', 'normal']);
});

it('leaves type orders other than normal/flying untouched', function () {
    expect($this->service->swapNormalFlyingOrder(['flying', 'normal']))->toBe(['flying', 'normal']);
    expect($this->service->swapNormalFlyingOrder(['fire', 'flying']))->toBe(['fire', 'flying']);
    expect($this->service->swapNormalFlyingOrder(['normal', null]))->toBe(['normal', null]);
});

it('reverts fairy typing to normal for the retconned gen 1/2 pokemon', function () {
    expect($this->service->revertFairyTyping(['fairy', null], 'clefairy'))->toBe(['normal', null]);
    expect($this->service->revertFairyTyping(['fairy', null], 'Togepi'))->toBe(['normal', null]);
});

it('keeps fairy typing for pokemon outside the retcon list', function () {
    expect($this->service->revertFairyTyping(['fairy', 'psychic'], 'gardevoir'))->toBe(['fairy', 'psychic']);
});

it('only reverts when the primary type is fairy', function () {
    expect($this->service->revertFairyTyping(['water', 'fairy'], 'azumarill'))->toBe(['water', 'fairy']);
});
