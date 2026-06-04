<?php

use App\Models\Pair;
use App\Models\Save;
use App\Models\User;
use Illuminate\Support\Facades\Http;

function saveOwnedBy(User $owner): Save
{
    return Save::create([
        'name' => 'Test Run',
        'player_one_name' => 'Ash',
        'player_two_name' => 'Gary',
        'swap_normal_flying_order' => false,
        'revert_fairy_typing' => false,
        'user_id' => $owner->id,
    ]);
}

function pairIn(Save $save): Pair
{
    return Pair::create([
        'save_id' => $save->id,
        'player_one_pokemon_name' => 'bulbasaur',
        'player_two_pokemon_name' => 'charmander',
        'player_one_pokemon_primary_type' => 'grass',
        'player_two_pokemon_primary_type' => 'fire',
        'is_alive' => 1,
    ]);
}

it('rejects a pair whose pokemon share the same primary type', function () {
    Http::fake(['pokeapi.co/*' => Http::response([
        'types' => [['type' => ['name' => 'water']]],
    ])]);

    $user = User::factory()->create();
    $save = saveOwnedBy($user);

    $this->actingAs($user)
        ->post("/saves/{$save->id}/pairs", [
            'playerOnePokemon' => 'squirtle',
            'playerTwoPokemon' => 'totodile',
        ])
        ->assertSessionHasErrors('samePrimaryType');

    expect(Pair::where('save_id', $save->id)->count())->toBe(0);
});

it('forbids adding a pair to a save owned by another user', function () {
    $save = saveOwnedBy(User::factory()->create());

    $this->actingAs(User::factory()->create())
        ->post("/saves/{$save->id}/pairs", [
            'playerOnePokemon' => 'bulbasaur',
            'playerTwoPokemon' => 'charmander',
        ])
        ->assertForbidden();

    expect(Pair::where('save_id', $save->id)->count())->toBe(0);
});

it('forbids updating a pair in a save owned by another user', function () {
    $save = saveOwnedBy(User::factory()->create());
    $pair = pairIn($save);

    $this->actingAs(User::factory()->create())
        ->put("/saves/{$save->id}/pairs/{$pair->id}", [
            'playerOneNickname' => 'Hacked',
        ])
        ->assertForbidden();

    expect($pair->fresh()->player_one_pokemon_nickname)->toBeNull();
});

it('forbids deleting a pair in a save owned by another user', function () {
    $save = saveOwnedBy(User::factory()->create());
    $pair = pairIn($save);

    $this->actingAs(User::factory()->create())
        ->delete("/saves/{$save->id}/pairs/{$pair->id}")
        ->assertForbidden();

    $this->assertDatabaseHas('pairs', ['id' => $pair->id]);
});

it('lets an owner delete their pair', function () {
    $user = User::factory()->create();
    $save = saveOwnedBy($user);
    $pair = pairIn($save);

    $this->actingAs($user)
        ->delete("/saves/{$save->id}/pairs/{$pair->id}")
        ->assertRedirect();

    $this->assertDatabaseMissing('pairs', ['id' => $pair->id]);
});
