<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pairs', function (Blueprint $table) {
            $table->integer('player_one_pokemon_id')->nullable()->after('save_id');
            $table->integer('player_two_pokemon_id')->nullable()->after('player_one_pokemon_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pairs', function (Blueprint $table) {
            $table->dropColumn('player_one_pokemon_id');
            $table->dropColumn('player_two_pokemon_id');
        });
    }
};
