<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateParkingInitModeDefault2 extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::table('parking', function ($table) {
            $table->enum('init_mode', array('0', '1', '2'))->after('etat')->default('2');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('parking', function ($table) {
            $table->dropColumn('init_mode');
        });
    }

}
