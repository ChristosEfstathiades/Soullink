<?php

namespace App\Http\Controllers;

use App\Models\Save;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SaveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $saves = Save::where('user_id', auth()->id())->get();
        return Inertia::render('dashboard', [
            'saves' => $saves,
        ]);
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
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'p1' => 'nullable|string|max:30',
            'p2' => 'nullable|string|max:30',
        ]);

        $save = Save::create([
            'name' => $request->name,
            'player_one_name' => $request->p1,
            'player_two_name' => $request->p2,
            'user_id' => auth()->id(),
        ]);
        return to_route('saves.show', $save);
    }

    /**
     * Display the specified resource.
     */
    public function show(Save $save)
    {
        return Inertia::render('tracker', [
            'save' => $save,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Save $save)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Save $save)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Save $save)
    {
        //
    }
}
