<?php

use App\Models\Pair;
use App\Models\Save;
use App\Models\User;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->user = User::factory()->create();

    $this->save = Save::create([
        'name' => 'Test Run',
        'player_one_name' => 'Ash',
        'player_two_name' => 'Gary',
        'swap_normal_flying_order' => false,
        'revert_fairy_typing' => false,
        'user_id' => $this->user->id,
    ]);

    // Two Pokémon with different primary types so the soullink rule passes.
    Http::fake([
        'pokeapi.co/api/v2/pokemon/bulbasaur' => Http::response([
            'types' => [['type' => ['name' => 'grass']], ['type' => ['name' => 'poison']]],
        ]),
        'pokeapi.co/api/v2/pokemon/charmander' => Http::response([
            'types' => [['type' => ['name' => 'fire']]],
        ]),
    ]);
});

it('stores a pair with the chosen location', function () {
    $this->actingAs($this->user)
        ->post("/saves/{$this->save->id}/pairs", [
            'playerOnePokemon' => 'bulbasaur',
            'playerTwoPokemon' => 'charmander',
            'location' => 'Route 1',
        ])
        ->assertSessionHasNoErrors();

    expect(Pair::where('save_id', $this->save->id)->first()->location)->toBe('Route 1');
});

it('allows adding a pair without a location', function () {
    $this->actingAs($this->user)
        ->post("/saves/{$this->save->id}/pairs", [
            'playerOnePokemon' => 'bulbasaur',
            'playerTwoPokemon' => 'charmander',
        ])
        ->assertSessionHasNoErrors();

    expect(Pair::where('save_id', $this->save->id)->first()->location)->toBeNull();
});

it('rejects a second pair caught at the same location', function () {
    $this->actingAs($this->user)
        ->post("/saves/{$this->save->id}/pairs", [
            'playerOnePokemon' => 'bulbasaur',
            'playerTwoPokemon' => 'charmander',
            'location' => 'Route 1',
        ])
        ->assertSessionHasNoErrors();

    $this->actingAs($this->user)
        ->post("/saves/{$this->save->id}/pairs", [
            'playerOnePokemon' => 'bulbasaur',
            'playerTwoPokemon' => 'charmander',
            'location' => 'Route 1',
        ])
        ->assertSessionHasErrors('location');

    expect(Pair::where('save_id', $this->save->id)->count())->toBe(1);
});

it('allows multiple pairs with no location', function () {
    foreach (range(1, 2) as $ignored) {
        $this->actingAs($this->user)
            ->post("/saves/{$this->save->id}/pairs", [
                'playerOnePokemon' => 'bulbasaur',
                'playerTwoPokemon' => 'charmander',
            ])
            ->assertSessionHasNoErrors();
    }

    expect(Pair::where('save_id', $this->save->id)->count())->toBe(2);
});

it('lets the same location be reused across different saves', function () {
    $otherSave = Save::create([
        'name' => 'Second Run',
        'player_one_name' => 'Ash',
        'player_two_name' => 'Gary',
        'swap_normal_flying_order' => false,
        'revert_fairy_typing' => false,
        'user_id' => $this->user->id,
    ]);

    $this->actingAs($this->user)
        ->post("/saves/{$this->save->id}/pairs", [
            'playerOnePokemon' => 'bulbasaur',
            'playerTwoPokemon' => 'charmander',
            'location' => 'Route 1',
        ])
        ->assertSessionHasNoErrors();

    $this->actingAs($this->user)
        ->post("/saves/{$otherSave->id}/pairs", [
            'playerOnePokemon' => 'bulbasaur',
            'playerTwoPokemon' => 'charmander',
            'location' => 'Route 1',
        ])
        ->assertSessionHasNoErrors();

    expect(Pair::whereIn('save_id', [$this->save->id, $otherSave->id])->count())->toBe(2);
});
