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
        Schema::create('s3_destinations', function (Blueprint $table) {
            $table->id();
            $table->string('bucket_name');
            $table->string('access_key_id');
            $table->string('access_key_secret');
            $table->string('region')->default('auto');
            $table->string('endpoint');
            $table->string('version')->default('latest');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('s3_destinations');
    }
};
