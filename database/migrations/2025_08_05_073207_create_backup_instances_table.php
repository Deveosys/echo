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
        Schema::create('backup_instances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('backup_id')->constrained('backups')->onDelete('cascade');
            $table->string('key_name')->nullable();
            $table->string('status')->default('pending');
            $table->string('error')->nullable();
            $table->datetime('started_at');
            $table->datetime('completed_at')->nullable();
            $table->datetime('failed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('backup_instances');
    }
};
