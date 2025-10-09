<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Pair extends Model
{
    protected $fillable = [
        'save_id',
        'player_one_pokemon_name',
        'player_two_pokemon_name',
        'player_one_pokemon_nickname',
        'player_two_pokemon_nickname',
        'player_one_pokemon_primary_type',
        'player_one_pokemon_secondary_type',
        'player_two_pokemon_primary_type',
        'player_two_pokemon_secondary_type',
        'is_alive',
    ];

    public function saveFile(): BelongsTo
    {
        return $this->belongsTo(Save::class, 'save_id');
    }
}
