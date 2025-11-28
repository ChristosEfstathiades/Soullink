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
        Schema::table('saves', function (Blueprint $table) {
            $table->boolean('swap_normal_flying_order')->default(false)->after('player_two_name');
            $table->boolean('revert_fairy_typing')->default(false)->after('swap_normal_flying_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('saves', function (Blueprint $table) {
            $table->dropColumn('swap_normal_flying_order');
            $table->dropColumn('revert_fairy_typing');
        });
    }
};
