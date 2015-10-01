<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SynchroParkingFields extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('parking', function ($t) {
            $t->timestamp('last_aff_update')->default('0000-00-00 00:00:00');
            $t->timestamp('last_synchro_ok')->default('0000-00-00 00:00:00');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('parking', function ($t) {
            $t->dropColumn('last_aff_update');
            $t->dropColumn('last_synchro_ok');
        });
    }

}
