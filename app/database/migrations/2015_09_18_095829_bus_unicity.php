<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class BusUnicity extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{

        Schema::table('bus', function ($t) {
            $t->dropUnique('v4_id');
//            $t->dropUnique('bus_v4_id_unique');
            $t->unique(['concentrateur_id','v4_id']);
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{

        Schema::table('bus', function ($t) {
            $t->dropUnique('bus_concentrateur_id_v4_id_unique');
            $t->unique('v4_id');
        });
	}

}
