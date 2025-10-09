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
        Schema::create('pairs', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('save_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('player_one_pokemon_name');
            $table->string('player_one_pokemon_nickname')->nullable();
            $table->string('player_one_pokemon_primary_type');
            $table->string('player_one_pokemon_secondary_type')->nullable();
            $table->string('player_two_pokemon_name');
            $table->string('player_two_pokemon_nickname')->nullable();
            $table->string('player_two_pokemon_primary_type');
            $table->string('player_two_pokemon_secondary_type')->nullable();
            $table->boolean('is_alive')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pairs');
    }
};
