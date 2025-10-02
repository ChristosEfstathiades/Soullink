<?php

namespace App\Http\Controllers;

use App\Models\Pair;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Save;
use App\Models\User;
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

        $pair = Pair::create([
            'save_id' => $save->id,
            'player_one_pokemon_name' => $request->playerOnePokemon,
            'player_two_pokemon_name' => $request->playerTwoPokemon,
            'player_one_pokemon_nickname' => $request->playerOneNickname,
            'player_two_pokemon_nickname' => $request->playerTwoNickname,
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

        // Gate::authorize('update', $pair);
        $pair->update([
            'player_one_pokemon_name' => $request->playerOnePokemon ?? $pair->player_one_pokemon_name,
            'player_two_pokemon_name' => $request->playerTwoPokemon ?? $pair->player_two_pokemon_name,
            'player_one_pokemon_nickname' => $request->playerOneNickname ?? $pair->player_one_pokemon_nickname,
            'player_two_pokemon_nickname' => $request->playerTwoNickname ?? $pair->player_two_pokemon_nickname,
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
