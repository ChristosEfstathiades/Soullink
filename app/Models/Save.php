<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Save extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'player_one_name',
        'player_two_name',
        'user_id',
    ];
}
