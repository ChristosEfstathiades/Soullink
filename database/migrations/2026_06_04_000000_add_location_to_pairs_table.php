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
            $table->string('location')->nullable()->after('player_two_pokemon_secondary_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pairs', function (Blueprint $table) {
            $table->dropColumn('location');
        });
    }
};
