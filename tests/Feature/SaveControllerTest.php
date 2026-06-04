<?php

use App\Models\Save;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function makeSave(User $owner, string $name = 'Test Run'): Save
{
    return Save::create([
        'name' => $name,
        'player_one_name' => 'Ash',
        'player_two_name' => 'Gary',
        'swap_normal_flying_order' => false,
        'revert_fairy_typing' => false,
        'user_id' => $owner->id,
    ]);
}

it('lists only the saves owned by the authenticated user', function () {
    $user = User::factory()->create();
    $own = makeSave($user, 'My Run');
    makeSave(User::factory()->create(), 'Someone Elses Run');

    $this->actingAs($user)
        ->get(route('saves.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('saves', 1)
            ->where('saves.0.id', $own->id));
});

it('lets an owner view their save tracker', function () {
    $user = User::factory()->create();
    $save = makeSave($user);

    $this->actingAs($user)
        ->get(route('saves.show', $save))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('tracker')
            ->where('save.id', $save->id));
});

it('forbids viewing a save owned by another user', function () {
    $save = makeSave(User::factory()->create());

    $this->actingAs(User::factory()->create())
        ->get(route('saves.show', $save))
        ->assertForbidden();
});

it('creates a save for the authenticated user and opens it', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('saves.store'), [
            'name' => 'My Run',
            'p1' => 'Ash',
            'p2' => 'Gary',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('saves', [
        'name' => 'My Run',
        'player_one_name' => 'Ash',
        'player_two_name' => 'Gary',
        'user_id' => $user->id,
    ]);
});

it('lets an owner delete their save', function () {
    $user = User::factory()->create();
    $save = makeSave($user);

    $this->actingAs($user)
        ->delete(route('saves.destroy', $save))
        ->assertRedirect(route('saves.index'));

    $this->assertDatabaseMissing('saves', ['id' => $save->id]);
});

it('forbids deleting a save owned by another user', function () {
    $save = makeSave(User::factory()->create());

    $this->actingAs(User::factory()->create())
        ->delete(route('saves.destroy', $save))
        ->assertForbidden();

    $this->assertDatabaseHas('saves', ['id' => $save->id]);
});
