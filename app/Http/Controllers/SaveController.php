<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaveRequest;
use App\Models\Pair;
use App\Models\Save;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

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
     * Store a newly created resource in storage.
     */
    public function store(StoreSaveRequest $request)
    {
        $save = Save::create([
            'name' => $request->name,
            'player_one_name' => $request->p1,
            'player_two_name' => $request->p2,
            'swap_normal_flying_order' => $request->swap_normal_flying_order ? 1 : 0,
            'revert_fairy_typing' => $request->revert_fairy_typing ? 1 : 0,
            'user_id' => auth()->id(),
        ]);

        return to_route('saves.show', $save);
    }

    /**
     * Display the specified resource.
     */
    public function show(Save $save)
    {
        Gate::authorize('view', $save);

        $pairs = Pair::where('save_id', $save->id)->orderBy('created_at', 'asc')->get();
        $alivePairs = $pairs->where('is_alive', 1)->values();
        $deadBox = $pairs->where('is_alive', 0)->values();

        return Inertia::render('tracker', [
            'save' => $save,
            'livingBox' => $alivePairs,
            'deathBox' => $deadBox,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Save $save)
    {
        Gate::authorize('delete', $save);
        $save->delete();

        return to_route('saves.index');
    }
}
